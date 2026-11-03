// Camera flow scenarios through the real getUserMedia path (a fake device plays fixtures/*.y4m) and the real MediaPipe model.
//   node tools/e2e/camera.mjs              run everything
//   node tools/e2e/camera.mjs denied leave run selected scenarios
import { closeAll, serve, open, note, camState, resultShown, traits, enter, clickBtn, chooseCamera, choosePointer, recordReactions, pointerGame, sleep } from './lib.mjs';

const DESK = { width: 1440, height: 900 };
const { srv, url } = await serve();
const fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const ready = page => page.waitForFunction(() => __wand.st.cap, null, { timeout: 120000 });

const scenarios = {
  async fullGame() {
    const { browser, page, errors } = await open(url, { video: 'wave.y4m' });
    await enter(page); await recordReactions(page); await chooseCamera(page);
    await ready(page); await sleep(4500);
    const early = await camState(page);
    check(!early.help, 'no help button right after loading (first detection does not stall the page)');
    check(early.fps < 40, `detection follows real video frames, not screen refreshes (fps ${early.fps})`);
    if (early.fps < 15) console.log('    note: this machine is too slow for a meaningful wave test, e.g. Low Power Mode');
    const t0 = Date.now(); while (!(await resultShown(page)) && Date.now() - t0 < 180000) await sleep(500);
    check(await resultShown(page), 'camera game reaches the result');
    console.log('    reactions', await page.evaluate(() => __reacts), 'winner', await page.evaluate(() => __wand.st.winner.id));
    console.log('    ' + (await traits(page)).join('\n    '));
    const end = await camState(page);
    check(!end.on && !end.stream, 'camera stream and detection are off on the result card');
    await page.evaluate(() => document.querySelector('#bAgain').click());
    await page.waitForFunction(() => __wand.cam.on && __wand.st.attempt === 0, null, { timeout: 30000 });
    await page.waitForFunction(() => __wand.st.obs.length >= 1, null, { timeout: 40000 });
    check(true, 'try again restarts the camera and takes a wave');
    check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close();
  },
  async leave() {
    const { browser, page, errors } = await open(url, { video: 'leave.y4m' });
    await enter(page); await chooseCamera(page); await ready(page);
    const t0 = Date.now(); while (!(await resultShown(page)) && Date.now() - t0 < 180000) await sleep(500);
    check(await resultShown(page), 'hand leaving the frame mid-wave still reaches the result');
    check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close();
  },
  async noHand() {
    const { browser, page, errors } = await open(url, { video: 'blank.y4m' });
    await enter(page); await chooseCamera(page); await ready(page);
    await sleep(2000); const a = await note(page); check(/руку|hand/i.test(a.status) && !a.btns.length, 'asks for the hand, no extra button yet');
    await sleep(8000); const b = await note(page);
    check(/Не бачу руки|can’t see/i.test(b.status), 'after ~8 s: a clear no-hand hint: ' + b.status);
    check(b.btns.length === 1, 'after ~8 s: offers finger or mouse');
    await page.waitForFunction(() => __wand.st.input === 'pointer', null, { timeout: 20000 });
    const c = await camState(page), d = await note(page);
    check(!c.on && !c.stream, 'after ~25 s: falls back by itself, camera off');
    console.log('    ', d.status);
    const r = await pointerGame(page, DESK); check(r.done, 'pointer game finishes after the fallback');
    check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close();
  },
  async trackEnded() {
    const { browser, page, errors } = await open(url, { video: 'wave.y4m' });
    await enter(page); await chooseCamera(page); await ready(page);
    await page.waitForFunction(() => __wand.st.cap && __wand.st.cap.active, null, { timeout: 30000 });
    await page.evaluate(() => { const t = __wand.cam.stream.getTracks()[0]; t.stop(); t.dispatchEvent(new Event('ended')); });
    await sleep(300); const s = await camState(page);
    check(s.input === 'pointer' && !s.stream, 'camera dying mid-wave drops to pointer');
    const r = await pointerGame(page, DESK); check(r.done, 'pointer game finishes');
    check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close();
  },
  async hiddenTab() {
    const { browser, page, errors } = await open(url, { video: 'wave.y4m' });
    await enter(page); await chooseCamera(page); await ready(page);
    const set = v => page.evaluate(h => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => h }); document.dispatchEvent(new Event('visibilitychange')); }, v);
    await set(true); await sleep(200); let s = await camState(page);
    check(!s.on && !s.stream, 'hiding the tab stops stream and detection');
    await set(false); await page.waitForFunction(() => __wand.cam.on, null, { timeout: 15000 });
    check(true, 'coming back restarts the camera');
    check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close();
  },
  async errorMessages() {
    const seen = new Set();
    for (const [name, re] of [['NotAllowedError', /заборонено/], ['NotFoundError', /не знайдено/], ['NotReadableError', /зайняла/]]) {
      const { browser, page } = await open(url, { init: `navigator.mediaDevices.getUserMedia = () => Promise.reject(new DOMException('x', '${name}'));` });
      await enter(page); await chooseCamera(page); await sleep(800); const n = await note(page);
      check(re.test(n.instr), `${name}: ${n.instr}`); seen.add(n.instr); await browser.close();
    }
    { const { browser, page } = await open(url, { init: `Object.defineProperty(navigator, 'mediaDevices', { value: undefined });` });
      await enter(page); await chooseCamera(page); await sleep(800); const n = await note(page); check(/не дає доступу/.test(n.instr), 'no mediaDevices: ' + n.instr); seen.add(n.instr); await browser.close(); }
    { const { browser, page } = await open(url, { init: `Object.defineProperty(window, 'isSecureContext', { value: false });` });
      await enter(page); await chooseCamera(page); await sleep(800); const n = await note(page); check(/https/.test(n.instr), 'insecure context: ' + n.instr); seen.add(n.instr); await browser.close(); }
    { const { browser, page, errors } = await open(url, { video: 'wave.y4m', route: p => p.route(/hand_landmarker\.task|vision_bundle/, r => r.abort()) });
      await enter(page); await chooseCamera(page); await sleep(2500); const n = await note(page), s = await camState(page);
      check(/розпізнавання/.test(n.instr), 'model load failure: ' + n.instr); check(!s.stream, 'camera released'); seen.add(n.instr);
      await clickBtn(page, 'Продовжити'); const r = await pointerGame(page, DESK); check(r.done, 'pointer game finishes'); check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close(); }
    check(seen.size === 6, 'all six messages differ');
  },
  async realDenial() {
    const { browser, page, errors } = await open(url, { fakeCam: true, grant: false });
    const ctx = page.context(); await ctx.clearPermissions();
    const cdp = await browser.newBrowserCDPSession(); await cdp.send('Browser.setPermission', { permission: { name: 'camera' }, setting: 'denied', origin: new URL(url).origin });
    await enter(page); await chooseCamera(page); await sleep(1500); const n = await note(page), s = await camState(page);
    check(/заборонено/.test(n.instr) && s.input === 'pointer', 'browser-level denial: ' + n.instr);
    check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close();
  },
  async watchdog() {
    // the model stalls for 40 s: button at ~6 s, automatic fallback ~15 s after permission
    const { browser, page, errors } = await open(url, { video: 'wave.y4m', route: p => p.route(/hand_landmarker\.task/, async r => { await sleep(40000); r.continue().catch(() => { }); }) });
    await enter(page); await chooseCamera(page);
    await sleep(3000); let n = await note(page); check(!n.btns.length, 'no way out button in the first seconds');
    await sleep(4000); n = await note(page); check(n.btns.length === 1, 'at ~6 s: offers finger or mouse: ' + n.status);
    const stalled = Date.now(); await page.waitForFunction(() => __wand.st.input === 'pointer', null, { timeout: 30000 }); console.log(`    fell back ${((Date.now() - stalled) / 1000 + 7).toFixed(1)} s after the click`);
    n = await note(page); const s = await camState(page);
    check(/надто довго|too long/.test(n.instr) && s.input === 'pointer' && !s.stream, 'at ~15 s: falls back by itself: ' + n.instr);
    await clickBtn(page, 'Продовжити'); const r = await pointerGame(page, DESK); check(r.done, 'pointer game finishes');
    check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close();
  },
  async latePermission() {
    const { browser, page, errors } = await open(url, { video: 'wave.y4m', init: `{ const o = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices); window.__late = []; navigator.mediaDevices.getUserMedia = async c => { await new Promise(r => setTimeout(r, 31000)); const s = await o(c); __late.push(s); return s; }; }` });
    await enter(page); await chooseCamera(page); await sleep(32500);
    const tracks = await page.evaluate(() => __late.flatMap(s => s.getTracks().map(t => t.readyState))), s = await camState(page);
    check(tracks.length === 1 && tracks[0] === 'ended', 'a grant after the fallback is dropped, the camera light goes off');
    check(s.input === 'pointer', 'game stays on pointer');
    check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close();
  },
  async inAppBrowser() {
    for (const ua of ['Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Instagram 300.0', 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120 Mobile [FB_IAB/FB4A;FBAV/450.0]', 'Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 Mobile/15E148 LinkedInApp', 'Mozilla/5.0 (Linux; Android 14) musical_ly_30 BytedanceWebview']) {
      const { browser, page } = await open(url, { userAgent: ua }); await enter(page); const n = await note(page);
      check(n.btns.length === 1 && /мишкою/.test(n.btns[0]) && /браузері/.test(n.instr), 'in-app: pointer only, with one hint: ' + ua.slice(-22)); await browser.close();
    }
    const { browser, page } = await open(url); await enter(page); const n = await note(page); check(n.btns.length === 2, 'regular browser still offers both'); await browser.close();
  }
};

const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(scenarios);
for (const n of names) { console.log('== ' + n); try { await scenarios[n](); } catch (e) { check(false, n + ' threw: ' + e.message.split('\n')[0]); } }
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);

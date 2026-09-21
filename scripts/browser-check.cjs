const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || '/opt/google/chrome/chrome',headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({acceptDownloads:true});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8765',{waitUntil:'networkidle'});
 const assert=(v,msg)=>{if(!v)throw Error(msg);};
 for(const width of [320,360,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Overflow '+width);
  await page.locator('#json').scrollIntoViewIfNeeded();
  await page.screenshot({path:`/tmp/portfolio-${width}.png`});
  if(width<=1000){await page.locator('.menu-toggle').click();assert(await page.locator('#site-nav').isVisible(),'menu');await page.locator('#site-nav a').first().focus();await page.keyboard.press('Escape');assert(await page.locator('.menu-toggle').evaluate(n=>n===document.activeElement),'menu restore');}
 }
 await page.keyboard.press('Control+Home');await page.locator('.skip-link').focus();await page.keyboard.press('Enter');assert(await page.evaluate(()=>document.activeElement.id==='main-content'),'skip focus');
 const labels=await page.locator('.artwork-trigger').evaluateAll(ns=>ns.map(n=>n.getAttribute('aria-label')));assert(new Set(labels).size===labels.length,'unique artwork labels');
 const trigger=page.locator('.artwork-trigger').first();await trigger.focus();await page.keyboard.press('Enter');assert(await page.locator('dialog').evaluate(n=>n.open),'dialog open');await page.keyboard.press('ArrowRight');assert((await page.locator('#dialog-count').textContent()).includes('2 of'),'next');await page.locator('#dialog-next').focus();await page.keyboard.press('Tab');assert(await page.locator('#dialog-close').evaluate(n=>n===document.activeElement),'trap');await page.keyboard.press('Escape');assert(await trigger.evaluate(n=>n===document.activeElement),'dialog restore');
 await page.locator('#comparison-range').focus();await page.keyboard.press('ArrowRight');assert(await page.locator('#comparison-range').inputValue()==='51','slider');
 for(const [name,value] of Object.entries({occasion:'apology',relationship:'partner',primary:'vulnerability',secondary:'tenderness',style:'tender-brutalism',aspect_ratio:'1:1',safe_area:'lower-right'}))await page.locator('#pg-'+name).selectOption(value);
 await page.locator('#pg-intensity').fill('4');await page.locator('#pg-intensity').dispatchEvent('input');
 let request=JSON.parse(await page.locator('#code-request').textContent());assert(request.style_system.id==='tender-brutalism'&&request.emotion.intensity===4&&request.composition.message_safe_area.position==='lower-right','composition');
 await page.locator('#tab-request').focus();await page.keyboard.press('ArrowRight');assert(await page.locator('#panel-batch').isVisible(),'tab arrow');await page.keyboard.press('Home');assert(await page.locator('#panel-schema').isVisible(),'tab home');await page.keyboard.press('End');assert(await page.locator('#panel-batch').isVisible(),'tab end');
 const batch=JSON.parse(await page.locator('#code-batch').textContent());assert(batch.requests.length===3,'batch');
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.locator('#copy-json').click();assert(JSON.parse(await page.evaluate(()=>navigator.clipboard.readText())).requests.length===3,'copy json');
 const downloadPromise=page.waitForEvent('download');await page.locator('#download-json').click();const download=await downloadPromise;assert(JSON.parse(fs.readFileSync(await download.path(),'utf8')).requests.length===3,'download');
 await page.locator('#reset-json').click();request=JSON.parse(await page.locator('#code-request').textContent());assert(request.style_system.id==='glitch-garden'&&request.emotion.intensity===9,'reset');
 await page.locator('#copy-email').click();assert(await page.evaluate(()=>navigator.clipboard.readText())==='connect.prolay@gmail.com','copy email');
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(Error('denied'))},configurable:true}));await page.locator('#copy-json').click();assert((await page.locator('#toast').textContent()).includes('Clipboard unavailable'),'clipboard denied');
 await page.locator('#technical-view').click();await page.reload();assert(await page.locator('#technical-view').getAttribute('aria-pressed')==='true','localStorage');await page.locator('#review-toggle').click();assert(await page.locator('#review-toggle').textContent()==='Full Portfolio','review');await page.locator('#review-toggle').click();
 await page.emulateMedia({reducedMotion:'reduce'});assert(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)==='auto','reduced motion');
 assert(errors.length===0,'console errors '+errors);
 const examples=await page.evaluate(()=>({...examples,asset_metadata:assetMetadata}));fs.writeFileSync('dist/downloads/prompt-examples.json',JSON.stringify(examples,null,2)+'\n');
 await page.locator('#creative-view').click();
 console.log('PASS: five widths, keyboard, menu, tabs, lightbox, slider, clipboard success/denial, JSON download/reset, storage, reduced motion.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

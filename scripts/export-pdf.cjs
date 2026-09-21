const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || '/opt/google/chrome/chrome',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.goto(process.env.PORTFOLIO_URL || 'http://127.0.0.1:8765',{waitUntil:'networkidle'});
 await page.emulateMedia({media:'print',reducedMotion:'reduce'});
 await page.evaluate(async()=>{
  document.body.classList.remove('quick-review','technical-view');
  document.querySelectorAll('[data-technical]').forEach(n=>n.hidden=true);
  for(const panel of document.querySelectorAll('[role="tabpanel"]'))panel.dataset.printTitle=document.getElementById(panel.getAttribute('aria-labelledby')).textContent;
  document.querySelectorAll('img').forEach(img=>{img.loading='eager';img.removeAttribute('srcset');});
  await Promise.all([...document.images].map(async img=>{
   await img.decode().catch(()=>{});if(!img.naturalWidth)return;
   const canvas=document.createElement('canvas');const scale=Math.min(1,800/img.naturalWidth);canvas.width=img.naturalWidth*scale;canvas.height=img.naturalHeight*scale;
   canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);img.src=canvas.toDataURL('image/jpeg',.8);await img.decode();
  }));
 });
 await page.pdf({path:path.resolve('dist/downloads/portfolio.pdf'),format:'A4',printBackground:true,margin:{top:'12mm',bottom:'12mm',left:'12mm',right:'12mm'},tagged:true});
 await browser.close();console.log('Updated dist/downloads/portfolio.pdf from current website.');
})().catch(e=>{console.error(e);process.exit(1)});

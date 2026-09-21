/* Local, provider-neutral examples. No image API is invoked. */
const styleSystems = [
  {id:'glitch-garden', name:'Glitch Garden Letters', version:'1.0.0', palette:['#FF4F9A','#D7FF3F','#192180','#FFF4DC'], materials:['botanical watercolor','fluorescent risograph','digital glitch collage'], rules:['one oversized organic focal form','misregistration limited to edges','imperfect texture; no polished vector finish']},
  {id:'tender-brutalism', name:'Tender Brutalism', version:'1.0.0', palette:['#B8B4AC','#F09A7D','#173F8F','#D4A62A'], materials:['brutalist geometry','vulnerable pencil marks','diary ephemera'], rules:['hard geometry holds soft characters','one repaired or imperfect object','restrained emotion, never cute','visible paper texture']},
  {id:'cosmic-scrapbook', name:'Cosmic Scrapbook', version:'1.0.0', palette:['#182A75','#C5C8D7','#B9A7DC','#FF6B35'], materials:['analog ephemera','Y2K fragments','torn paper'], rules:['two worlds joined by one visual thread','personal objects replace generic icons','torn-paper depth','interface fragments stay unreadable']}
];
const assetMetadata = {example_only:true, asset_id:'sample-glitch-birthday-001', style_version:'1.0.0', prompt_version:'1.0.0', model:'TODO: verified exact model identifier', generation_status:'illustrative_approved', evaluation:{method:'illustrative reviewer rubric, not measured results', scale:{min:1,max:5}, scores:{emotional_fit:4,focal_clarity:4,palette_consistency:5,material_logic:4,message_safe_space:4}}, storage_uri:null};
const promptForm = document.getElementById('playground');
const tabs = [...document.querySelectorAll('[role="tab"]')];
let activeExample = 'request';
let examples;
function composeRequest(values, style) {
  return {prompt_version:'1.0.0', occasion:values.occasion, relationship:values.relationship, emotion:{primary:values.primary,secondary:values.secondary,intensity:Number(values.intensity)}, style_system:{...style, rules:[...style.rules,'minimum 30 percent message-safe space']}, composition:{aspect_ratio:values.aspect_ratio,message_safe_area:{position:values.safe_area,minimum_percent:30}}, avoid:['generic stock illustration','embedded readable text','artist imitation'], generation:{status:'not_submitted',model:null}};
}
function updateExamples() {
  const values = Object.fromEntries(new FormData(promptForm));
  const selectedStyle = styleSystems.find(style => style.id === values.style);
  if (!selectedStyle || !promptForm.checkValidity()) {
    document.getElementById('json-status').textContent = 'Check the selected controls before exporting.';
    return;
  }
  const request = composeRequest(values, selectedStyle);
  examples = {
    schema:{schema_version:'1.0.0',description:'Reusable style definitions and composition contract; provider-neutral example, not a vendor API payload.',style_systems:styleSystems,variable_contract:{required:['occasion','relationship','emotion','style_system','composition'],intensity:{type:'integer',minimum:1,maximum:10},aspect_ratio:['4:5','1:1','9:16','16:9'],message_safe_area:{positions:['upper-left','upper-right','lower-left','lower-right'],minimum_percent:30}}},
    request,
    batch:{manifest_version:'1.0.0',batch_id:'example-three-style-study',status:'draft_not_submitted',description:'Same selected brief across all three styles for controlled comparison.',requests:styleSystems.map((style,index)=>({request_id:`example-${index+1}`, ...composeRequest(values,style)})),evaluation_plan:{scale:'1–5 reviewer rubric',criteria:['emotional fit','focal clarity','palette consistency','material logic','message-safe space'],approval:'human review required',on_failure:'revise one variable group and regenerate'}}
  };
  for (const [key,value] of Object.entries(examples)) document.getElementById(`code-${key}`).textContent = JSON.stringify(value,null,2);
  document.getElementById('intensity-value').textContent = `${values.intensity} / 10`;
  document.getElementById('json-status').textContent = 'Valid JSON · local preview updated · no render submitted.';
}
function activateTab(tab, focus = true) {
  activeExample = tab.id.replace('tab-','');
  tabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected',String(active));
    item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
  });
  if (focus) tab.focus();
}
tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>activateTab(tab));
  tab.addEventListener('keydown',event=>{
    let next;
    if (event.key === 'ArrowRight') next = (index+1)%tabs.length;
    if (event.key === 'ArrowLeft') next = (index+tabs.length-1)%tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length-1;
    if (next !== undefined) {event.preventDefault();activateTab(tabs[next]);}
  });
});
promptForm.addEventListener('submit',event=>event.preventDefault());
promptForm.addEventListener('input',updateExamples);
document.getElementById('copy-json').addEventListener('click',()=>copyText(JSON.stringify(examples[activeExample],null,2),'JSON copied to clipboard.'));
document.getElementById('download-json').addEventListener('click',()=>{
  const blob = new Blob([JSON.stringify(examples[activeExample],null,2)+'\n'],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href=url; link.download=`heartstamp-${activeExample}.json`;
  document.body.append(link); link.click(); link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  showToast('JSON download prepared.');
});
document.getElementById('reset-json').addEventListener('click',()=>{promptForm.reset();updateExamples();activateTab(document.getElementById('tab-request'),false);showToast('Default request restored.');});
document.getElementById('asset-metadata').textContent=JSON.stringify(assetMetadata,null,2);
updateExamples();

const form=document.querySelector('#form'), input=document.querySelector('#question'), conversation=document.querySelector('#conversation'), send=form.querySelector('button'), reset=document.querySelector('#new-chat');
const quote=document.querySelector('#quote-dialog'), quoteForm=document.querySelector('#quote-form'), draft=document.querySelector('#draft-email');
const welcome=conversation.innerHTML;
let busy=false, history=[];
function add(role,text,products=[]){
 const el=document.createElement('div');el.className='bubble '+role;
 const cards=Array.isArray(products)?products.filter(p=>typeof p.title==='string'&&typeof p.url==='string'&&/^https:\/\/www\.tamperproof\.com\/[a-zA-Z0-9_\-/]+$/.test(p.url)).slice(0,3):[];
 const productUrls=new Set(cards.map(p=>p.url));
 const re=/(https:\/\/www\.tamperproof\.com\/[a-zA-Z0-9_\-/]*)/g;
 for(const part of text.split(re)){if(productUrls.has(part))continue;if(part.startsWith('https://www.tamperproof.com/')){const a=document.createElement('a');a.href=part;a.textContent=part;a.target='_blank';a.rel='noreferrer';el.append(a)}else el.append(document.createTextNode(part))}
 conversation.append(el);
 if(cards.length){const list=document.createElement('div');list.className='product-cards';for(const p of cards){const card=document.createElement('div');card.className='product-card';const label=document.createElement('small');label.textContent='Product family';const title=document.createElement('strong');title.textContent=p.title;const note=document.createElement('p');note.textContent='Check the product page or contact us to confirm size and availability.';const actions=document.createElement('div');actions.className='card-actions';const link=document.createElement('a');link.href=p.url;link.target='_blank';link.rel='noreferrer';link.textContent='View product ↗';const select=document.createElement('button');select.type='button';select.textContent='Use for quote';select.addEventListener('click',()=>{quoteForm.elements.product.value=p.title;updateDraft();quote.showModal()});actions.append(link,select);card.append(label,title,note,actions);list.append(card)}conversation.append(list)}
 conversation.scrollTop=conversation.scrollHeight;return el
}
async function ask(question){question=question.trim();if(busy||!question)return;busy=true;send.disabled=true;reset.disabled=true;input.disabled=true;conversation.querySelector('#suggestions')?.remove();add('user',question);input.value='';const loading=add('assistant','Looking into that…');try{const response=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:question,history})});const data=await response.json();loading.remove();const text=data.answer||data.error||'Please contact us at 516-931-1616 or info@tamperproof.com.';add('assistant',text,data.products);if(response.ok&&data.answer){history.push({role:'user',content:question},{role:'assistant',content:data.answer.slice(0,1800)});history=history.slice(-10)}}catch{loading.remove();add('assistant','The assistant is temporarily unavailable. Please contact us at 516-931-1616 or info@tamperproof.com.')}finally{busy=false;send.disabled=false;reset.disabled=false;input.disabled=false;input.focus()}}
form.addEventListener('submit',e=>{e.preventDefault();void ask(input.value)});
conversation.addEventListener('click',e=>{const button=e.target.closest('#suggestions button');if(button)void ask(button.textContent.replace(/\s*↗$/,''))});
reset.addEventListener('click',()=>{if(busy)return;history=[];conversation.innerHTML=welcome;input.value='';input.focus()});
function updateDraft(){const f=quoteForm.elements;const lines=['Hello Tamperproof,','','I would like to request a quote.','',`Product: ${f.product.value||'Not specified'}`,`Size or thread: ${f.size.value||'Not specified'}`,`Quantity: ${f.quantity.value||'Not specified'}`,`Other details: ${f.details.value||'Not specified'}`];if(f.includeChat.checked){const messages=history.filter(m=>m.role==='user').map(m=>m.content).join('\n- ').slice(0,3500);if(messages)lines.push('','Recent questions I asked:','- '+messages)}lines.push('','Please let me know the next steps.','Thank you.');draft.href='mailto:info@tamperproof.com?subject='+encodeURIComponent('Request for a product quote')+'&body='+encodeURIComponent(lines.join('\r\n'))}
document.querySelector('#quote-open').addEventListener('click',()=>{updateDraft();quote.showModal()});document.querySelector('#quote-close').addEventListener('click',()=>quote.close());quoteForm.addEventListener('input',updateDraft);quoteForm.addEventListener('change',updateDraft);quoteForm.addEventListener('submit',e=>e.preventDefault());

const humanDialog=document.querySelector('#human-dialog');
document.querySelector('#human-open').addEventListener('click',()=>humanDialog.showModal());
document.querySelector('#human-close').addEventListener('click',()=>humanDialog.close());


let inputAr = JSON.parse(localStorage.getItem('inputAr')) || [];
let activeAr = JSON.parse(localStorage.getItem('activeAr')) || [];
let completedAr = JSON.parse(localStorage.getItem('completedAr')) || [];

let currentView = 'all';

normalizeLoadedArrays();
renderAll();

function normalizeLoadedArrays(){
  if (!Array.isArray(inputAr)) inputAr = [];
  if (!Array.isArray(completedAr)) completedAr = [];
  if (completedAr.length && typeof completedAr[0] === 'boolean'){
    let bools = completedAr;
    completedAr = [];
    for (let i=0;i<inputAr.length;i++){
      if (bools[i]) completedAr.push(inputAr[i]);
    }
  }
  deriveActive();
  persist();
}

function persist(){
  localStorage.setItem('inputAr', JSON.stringify(inputAr));
  localStorage.setItem('activeAr', JSON.stringify(activeAr));
  localStorage.setItem('completedAr', JSON.stringify(completedAr));
}

function deriveActive(){
  activeAr = inputAr.filter(t => !completedAr.includes(t));
}

function getInputEl(){
  return document.querySelector('.input');
}

function gettingInput(){
  const el = getInputEl();
  if (!el) return;
  const val = el.value.trim();
  if (val === '') return;
  inputAr.push(val);
  deriveActive();
  persist();
  el.value = '';
  el.focus();
  if (currentView === 'completed') {
    renderAll();
  } else {
    renderCurrent();
  }
}

function renderAll(){
  currentView = 'all';
  highlight('all');
  let html = '';
  for (let i=0;i<inputAr.length;i++){
    const task = inputAr[i];
    const checked = completedAr.includes(task) ? 'checked' : '';
    const cls = completedAr.includes(task) ? 'checked-p' : '';
    html += `<div class="div-inner-line2">
      <div><input type="checkbox" ${checked} onclick="markCompleted(${i}, this)" class="input-sec2"></div>
      <div><p class="p-sec2 ${cls}">${escapeHtml(task)}</p></div>
      <div><button onclick="deleteButton(${i})" class="button-sec2">Delete</button></div>
    </div>`;
  }
  updateTaskList(html);
}

function renderActive(){
  currentView = 'active';
  highlight('active');
  const list = inputAr.map((t,idx)=>({t,idx})).filter(obj => !completedAr.includes(obj.t));
  let html = '';
  for (let obj of list){
    html += `<div class="div-inner-line2">
      <div><input type="checkbox" onclick="markCompleted(${obj.idx}, this)" class="input-sec2"></div>
      <div><p class="p-sec2">${escapeHtml(obj.t)}</p></div>
      <div><button onclick="deleteButton(${obj.idx})" class="button-sec2">Delete</button></div>
    </div>`;
  }
  updateTaskList(html);
}

function renderCompleted(){
  currentView = 'completed';
  highlight('completed');
  const list = inputAr.map((t,idx)=>({t,idx})).filter(obj => completedAr.includes(obj.t));
  let html = '';
  for (let obj of list){
    html += `<div class="div-inner-line2">
      <div><input type="checkbox" checked onclick="markCompleted(${obj.idx}, this)" class="input-sec2"></div>
      <div><p class="p-sec2 checked-p">${escapeHtml(obj.t)}</p></div>
      <div><button onclick="deleteButton(${obj.idx})" class="button-sec2">Delete</button></div>
    </div>`;
  }
  updateTaskList(html);
}

function addingToAll(){ gettingInputIfAnyThen(renderAll); }
function addingToActive(){ renderActive(); }
function addingToCompleted(){ renderCompleted(); }

function gettingInputIfAnyThen(cb){
  cb();
}

function markCompleted(index, checkbox){
  const task = inputAr[index];
  if (typeof task === 'undefined') return;
  if (checkbox && checkbox.checked){
    if (!completedAr.includes(task)) completedAr.push(task);
  } else {
    completedAr = completedAr.filter(t => t !== task);
  }
  deriveActive();
  persist();
  renderCurrent();
}

function deleteButton(index){
  if (typeof index !== 'number') return;
  const task = inputAr[index];
  if (typeof task === 'undefined') return;
  inputAr.splice(index,1);
  completedAr = completedAr.filter(t => t !== task);
  deriveActive();
  persist();
  renderCurrent();
}

function usingEnter(key){
  if (key === 'Enter') {
    gettingInput();
    renderCurrent();
  }
}

function clearCompletedTasks(){
  inputAr = inputAr.filter(t => !completedAr.includes(t));
  completedAr = [];
  deriveActive();
  persist();
  renderCurrent();
}

function renderCurrent(){
  if (currentView === 'all') renderAll();
  else if (currentView === 'active') renderActive();
  else if (currentView === 'completed') renderCompleted();
  else renderAll();
}

function updateTaskList(html){
  const node = document.querySelector('.js-tasks');
  if (!node) return;
  if (!html || html.trim() === '') node.innerHTML = 'No Tasks To Show';
  else node.innerHTML = html;
}

function highlight(view){
  const a = document.querySelector('.button-all');
  const b = document.querySelector('.button-active');
  const c = document.querySelector('.button-completed');
  if (a) a.classList.toggle('add-click', view === 'all');
  if (b) b.classList.toggle('add-click', view === 'active');
  if (c) c.classList.toggle('add-click', view === 'completed');
}

function escapeHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

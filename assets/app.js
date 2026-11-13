
const money = value => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(value);

const productData = [
{name:'Espresso',desc:'Café concentrado de sabor intenso y aroma profundo.',price:5000,category:'calientes'},
{name:'Espresso Doble',desc:'Doble porción de espresso, intenso y con mucho cuerpo.',price:7000,category:'calientes'},
{name:'Americano',desc:'Espresso mezclado con agua caliente, suave y ligero.',price:6000,category:'calientes'},
{name:'Café Filtrado',desc:'Preparado por goteo para resaltar las notas del grano.',price:7000,category:'calientes'},
{name:'Capuccino',desc:'Espresso con leche vaporizada y espuma cremosa.',price:9000,category:'calientes'},
{name:'Latte',desc:'Espresso con leche vaporizada y una fina capa de espuma.',price:10000,category:'calientes'},
{name:'Mocaccino',desc:'Una combinación de espresso, chocolate y leche.',price:11000,category:'calientes'},
{name:'Macchiato',desc:'Espresso con un toque de espuma de leche.',price:8500,category:'calientes'},
{name:'Chocolate Caliente',desc:'Bebida cremosa preparada con chocolate y leche.',price:9500,category:'calientes'},
{name:'Té (Negro, Verde o Manzanilla)',desc:'Infusión caliente para acompañar cualquier momento.',price:6500,category:'calientes'},
{name:'Café Frío (Iced Coffee)',desc:'Café servido con hielo, refrescante y equilibrado.',price:9000,category:'frias'},
{name:'Iced Latte',desc:'Espresso con leche fría y hielo.',price:11000,category:'frias'},
{name:'Cold Brew',desc:'Café extraído en frío, suave y poco amargo.',price:12000,category:'frias'},
{name:'Frappé de Café',desc:'Café licuado con hielo, cremoso y refrescante.',price:14000,category:'frias'},
{name:'Frappé de Chocolate',desc:'Mezcla cremosa de chocolate y hielo.',price:15000,category:'frias'},
{name:'Limonada Natural',desc:'Limón fresco, agua y hielo.',price:8000,category:'frias'},
{name:'Limonada de Coco',desc:'Mezcla tropical de limón y coco.',price:12000,category:'frias'},
{name:'Soda Italiana',desc:'Frutos rojos, maracuyá o blueberry.',price:12000,category:'frias'},
{name:'Té Helado',desc:'Té frío servido con hielo.',price:8500,category:'frias'},
{name:'Jugo Natural en Agua',desc:'Fruta fresca licuada con agua.',price:8500,category:'frias'},
{name:'Jugo Natural en Leche',desc:'Fruta fresca mezclada con leche.',price:10500,category:'frias'},
{name:'Dátil glaseado con helado',desc:'Helado de vainilla, salsa de toffee y crumble de cacahuete.',price:10000,category:'postres'},
{name:'Pastel de queso clásico',desc:'Mermelada de frambuesa y fresas laminadas.',price:9000,category:'postres'},
{name:'Tarta de limón y merengue',desc:'Merengue de limón, pistacho y crema chantillí.',price:11000,category:'postres'},
{name:'Mousse de chocolate · individual',desc:'Nuestro mousse de chocolate en porción individual.',price:10000,category:'postres'},
{name:'Mousse de chocolate · doble',desc:'Una porción doble para compartir.',price:15000,category:'postres'},
{name:'Pastel de zanahoria',desc:'Pastel especiado con glaseado de queso crema.',price:8000,category:'postres'},
{name:'Brownie',desc:'Brownie recién horneado con chocolate negro y nueces.',price:9000,category:'postres'}
];

const $=(s,root=document)=>root.querySelector(s); const $$=(s,root=document)=>[...root.querySelectorAll(s)];

function toast(message){let el=$('.toast');if(!el){el=document.createElement('div');el.className='toast';document.body.append(el)}el.textContent=message;el.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove('show'),2800)}

// Header navigation and mobile menu

const toggle=$('.menu-toggle');toggle?.addEventListener('click',()=>{const open=document.body.classList.toggle('menu-open');toggle.setAttribute('aria-expanded',String(open))});

$$('.main-nav a').forEach(a=>{if(a.dataset.nav===document.body.dataset.page || a.getAttribute('href')===location.pathname.split('/').pop())a.classList.add('active');a.addEventListener('click',()=>document.body.classList.remove('menu-open'))});
const pageName=location.pathname.split('/').pop()||'index.html';
const navKey={'index.html':'index','menu.html':'menu','pedidos.html':'pedidos','eventos.html':'eventos','reservas.html':'reservas','nosotros.html':'nosotros','contacto.html':'contacto'};
const active=$(`[data-nav="${navKey[pageName]||'eventos'}"]`);active?.classList.add('active');

$$('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const topBtn=$('.back-top');window.addEventListener('scroll',()=>topBtn?.classList.toggle('visible',window.scrollY>450),{passive:true});

// Newsletter and contact/reservation forms: prepare a message in the visitor's mail app.

$$('[data-mail-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;
const data=new FormData(form);
const subject=form.dataset.subject||'Mensaje desde Perceptions Café';
const body=[...data.entries()].map(([k,v])=>`${k}: ${v}`).join('\n');
const href=`mailto:soporte@perceptions.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;window.location.href=href;toast('Tu mensaje está listo para enviarse desde tu correo.')}));

const dateInput=$('#res-date');if(dateInput){const now=new Date();
const local=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10);dateInput.min=local;}

// Online ordering cart

let cart={};
const grid=$('#order-grid');
function renderProducts(filter='todos'){if(!grid)return;grid.innerHTML='';productData.filter(p=>filter==='todos'||p.category===filter).forEach((p)=>{const index=productData.indexOf(p);
const card=document.createElement('article');card.className='order-product';card.innerHTML=`<span class="product-category">${p.category==='calientes'?'Bebidas calientes':p.category==='frias'?'Bebidas frías':'Postres'}</span><h3>${p.name}</h3><p>${p.desc}</p><div class="product-bottom"><strong>${money(p.price)}</strong><button class="add-product" aria-label="Agregar ${p.name}" data-add="${index}">+</button></div>`;grid.append(card)});}

function renderCart(){const target=$('[data-cart-items]');if(!target)return;
const entries=Object.entries(cart).filter(([,qty])=>qty>0);
const count=entries.reduce((s,[,q])=>s+q,0);
const total=entries.reduce((s,[id,q])=>s+productData[+id].price*q,0);$('[data-cart-count]').textContent=count;$('[data-cart-total]').textContent=money(total);if(!entries.length){target.innerHTML='<p class="cart-empty">Todavía no has agregado productos.</p>';return;}target.innerHTML=entries.map(([id,q])=>{const p=productData[+id];return `<div class="cart-line"><div><strong>${p.name}</strong><small>${money(p.price)} c/u</small></div><div class="qty-control"><button data-qty="${id}" data-delta="-1" aria-label="Quitar uno">−</button><span>${q}</span><button data-qty="${id}" data-delta="1" aria-label="Agregar uno">+</button></div></div>`}).join('')}

if(grid){renderProducts();renderCart();
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
$$('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderProducts(b.dataset.filter)}));grid.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(!b)return;
const id=b.dataset.add;cart[id]=(cart[id]||0)+1;renderCart();toast(`${productData[+id].name} agregado al pedido.`)});$('[data-cart-items]').addEventListener('click',e=>{const b=e.target.closest('[data-qty]');if(!b)return;
const id=b.dataset.qty;cart[id]=(cart[id]||0)+Number(b.dataset.delta);if(cart[id]<=0)delete cart[id];renderCart()});$('[data-checkout]').addEventListener('click',()=>{const entries=Object.entries(cart).filter(([,q])=>q>0);if(!entries.length){toast('Agrega al menos un producto para continuar.');return}const name=$('#order-name').value.trim();if(!name){$('#order-name').focus();toast('Escribe tu nombre para continuar.');return}const lines=entries.map(([id,q])=>`${q} x ${productData[+id].name} — ${money(productData[+id].price*q)}`);
const total=entries.reduce((s,[id,q])=>s+productData[+id].price*q,0);
const body=`Nombre: ${name}\nModalidad: ${$('#order-method').value}\n\n${lines.join('\n')}\n\nTotal: ${money(total)}\n\nNotas: ${$('#order-notes').value||'Sin notas'}`;location.href=`mailto:soporte@perceptions.com?subject=${encodeURIComponent('Pedido online - Perceptions Café')}&body=${encodeURIComponent(body)}`;});}

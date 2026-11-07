import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Search, UserRound, ShoppingBag, Menu, X, ArrowRight, ArrowLeft,
  Heart, Star, Plus, Minus, Trash2, ChevronDown, MapPin, Phone,
  Mail, Clock, Instagram, Facebook, CheckCircle2, CakeSlice, Truck,
  ShieldCheck, Sparkles, ChevronRight
} from "lucide-react";
import "./styles.css";

const categories = [
  { name: "Cakes", image: "photo-1578985545062-69928b1d9587" },
  { name: "Wedding Cakes", image: "photo-1535254973040-607b474cb50d" },
  { name: "Kulfi", image: "photo-1488900128323-21503983a07e" },
  { name: "Pizza", image: "photo-1513104890138-7c749659a591" },
  { name: "Breads & Buns", image: "photo-1509440159596-0249088772ff" },
  { name: "Drinks", image: "photo-1544145945-f90425340c7e" },
  { name: "Cookies", image: "photo-1499636136210-6f4ee915583e" }
];

const products = [
  { id: 1, name: "Chocolate Truffle Cake", category: "Cakes", price: 650, rating: "4.9", weight: "500 g", image: "photo-1578985545062-69928b1d9587", description: "Rich chocolate layers finished with silky ganache. A timeless favourite for every celebration.", tags: ["Bestseller", "Chocolate"] },
  { id: 2, name: "Red Velvet Cake", category: "Cakes", price: 720, rating: "4.8", weight: "500 g", image: "photo-1586788680434-30d324b2d46f", description: "Soft cocoa sponge layered with a delicate cream cheese-style frosting.", tags: ["Popular", "Celebration"] },
  { id: 3, name: "Fresh Strawberry Cake", category: "Cakes", price: 780, rating: "4.9", weight: "500 g", image: "photo-1562440499-64c9a111f713", description: "Light, fluffy cake with fresh strawberry notes and a beautifully soft finish.", tags: ["Fresh", "Seasonal"] },
  { id: 4, name: "Mango Delight", category: "Cakes", price: 750, rating: "4.7", weight: "500 g", image: "photo-1571115177098-24ec42ed204d", description: "A sunny mango-forward celebration cake with smooth, creamy layers.", tags: ["Seasonal"] },
  { id: 5, name: "Classic Celebration Cake", category: "Wedding Cakes", price: 3200, rating: "5.0", weight: "1.5 kg", image: "photo-1535254973040-607b474cb50d", description: "An elegant centrepiece made to match your special day. Customisation available.", tags: ["Custom made"] },
  { id: 6, name: "Malai Kulfi", category: "Kulfi", price: 90, rating: "4.8", weight: "1 pc", image: "photo-1488900128323-21503983a07e", description: "Creamy, slow-set kulfi with a delicate traditional flavour.", tags: ["Classic"] },
  { id: 7, name: "Garden Fresh Pizza", category: "Pizza", price: 280, rating: "4.7", weight: "Regular", image: "photo-1513104890138-7c749659a591", description: "A crisp base topped with colourful vegetables, herbs and melted cheese.", tags: ["Savoury"] },
  { id: 8, name: "Country Loaf", category: "Breads & Buns", price: 120, rating: "4.8", weight: "400 g", image: "photo-1509440159596-0249088772ff", description: "A golden crust and soft centre, baked fresh for your everyday table.", tags: ["Freshly baked"] },
  { id: 9, name: "Rose Milk", category: "Drinks", price: 80, rating: "4.6", weight: "250 ml", image: "photo-1544145945-f90425340c7e", description: "A refreshing, fragrant classic served chilled.", tags: ["Chilled"] },
  { id: 10, name: "Butter Cookies", category: "Cookies", price: 160, rating: "4.9", weight: "200 g", image: "photo-1499636136210-6f4ee915583e", description: "Golden, crisp-edged cookies with a delicate buttery bite.", tags: ["Tea-time"] }
];

const img = (id, w=900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
const money = n => `₹${Number(n).toLocaleString("en-IN")}`;

function App() {
  const [page, setPage] = useState("home");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(products[0]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("bb-cart") || "[]"));
  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [sort, setSort] = useState("Featured");
  const [weight, setWeight] = useState("500 g");
  const [quantity, setQuantity] = useState(1);
  const [checkoutDone, setCheckoutDone] = useState(false);

  useEffect(() => localStorage.setItem("bb-cart", JSON.stringify(cart)), [cart]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const go = (next) => { setPage(next); setMobileMenu(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const notify = (message) => setToast(message);
  const addToCart = (product, qty=1, chosenWeight) => {
    setCart(old => {
      const key = `${product.id}-${chosenWeight || product.weight}`;
      const found = old.find(i => i.key === key);
      if (found) return old.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      return [...old, { key, id: product.id, name: product.name, price: product.price, image: product.image, weight: chosenWeight || product.weight, qty }];
    });
    notify("Added to your bag");
  };
  const updateQty = (key, delta) => setCart(old => old.map(i => i.key === key ? {...i, qty: Math.max(1, i.qty + delta)} : i));
  const removeItem = key => setCart(old => old.filter(i => i.key !== key));
  const openProduct = product => { setSelected(product); setWeight(product.weight); setQuantity(1); go("product"); };

  const Header = () => (
    <header className="header">
      <button className="mobile-toggle icon-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Open menu">{mobileMenu ? <X/> : <Menu/>}</button>
      <button className="brand" onClick={() => go("home")} aria-label="Bakery Bar home">
        <span className="brand-mark"><CakeSlice size={23}/></span>
        <span><strong>BAKERY BAR</strong><small>FRESHLY MADE, BEAUTIFULLY SHARED</small></span>
      </button>
      <nav className={mobileMenu ? "nav open" : "nav"}>
        <button onClick={() => go("home")}>Home</button>
        <button onClick={() => go("story")}>About Us</button>
        <button onClick={() => {setCategory("All"); go("products");}}>Our Products</button>
        <button onClick={() => {setCategory("Wedding Cakes"); go("products");}}>Custom Cakes</button>
        <button onClick={() => go("contact")}>Contact</button>
      </nav>
      <div className="header-actions">
        <label className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} onFocus={()=>go("products")} placeholder="Search"/></label>
        <button className="icon-button" onClick={() => go("account")} aria-label="Account"><UserRound/></button>
        <button className="icon-button bag-button" onClick={() => go("cart")} aria-label="Shopping bag"><ShoppingBag/>{cartCount > 0 && <i>{cartCount}</i>}</button>
      </div>
    </header>
  );

  const Footer = () => (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand"><div className="brand brand-static"><span className="brand-mark"><CakeSlice/></span><span><strong>BAKERY BAR</strong><small>FRESHLY MADE, BEAUTIFULLY SHARED</small></span></div><p>Little moments deserve something delicious. Baked with care, made to be shared.</p><div className="socials"><Instagram/><Facebook/></div></div>
        <div><h4>Explore</h4><button onClick={()=>go("home")}>Home</button><button onClick={()=>go("story")}>Our Story</button><button onClick={()=>go("products")}>Shop All</button><button onClick={()=>go("contact")}>Contact</button></div>
        <div><h4>Customer Care</h4><button onClick={()=>go("account")}>My Account</button><button onClick={()=>go("cart")}>Shopping Bag</button><a href="#delivery">Delivery Information</a><a href="#policy">Privacy & Policies</a></div>
        <div><h4>Get in touch</h4><p><Phone size={15}/> +91 98765 43210</p><p><Mail size={15}/> hello@bakerybar.in</p><p><MapPin size={15}/> Chennai, Tamil Nadu</p></div>
      </div>
      <div className="footer-bottom"><span>© 2026 Bakery Bar. All rights reserved.</span><span>Made with care, served with love.</span></div>
    </footer>
  );

  const ProductCard = ({product}) => (
    <article className="product-card">
      <div className="product-photo" onClick={()=>openProduct(product)}><img src={img(product.image,650)} alt={product.name}/><span className="product-tag">{product.tags[0]}</span><button className={`heart ${wishlist.includes(product.id)?"active":""}`} onClick={e=>{e.stopPropagation();setWishlist(w=>w.includes(product.id)?w.filter(x=>x!==product.id):[...w,product.id]);notify(wishlist.includes(product.id)?"Removed from favourites":"Saved to favourites");}} aria-label="Add to favourites"><Heart size={18}/></button></div>
      <div className="product-info"><div className="product-title-row"><h3 onClick={()=>openProduct(product)}>{product.name}</h3><span className="rating"><Star size={13} fill="currentColor"/> {product.rating}</span></div><p>{product.weight}</p><div className="product-buy"><strong>{money(product.price)}</strong><button className="small-add" onClick={()=>addToCart(product)}>Add <Plus size={14}/></button></div></div>
    </article>
  );

  const Home = () => (
    <>
      <section className="hero">
        <div className="hero-copy"><span className="eyebrow">A LITTLE JOY IN EVERY BITE</span><h1>Made with love.<br/><em>Shared with joy.</em></h1><p>From everyday treats to once-in-a-lifetime celebrations, discover freshly made delights crafted with care.</p><div className="hero-buttons"><button className="btn btn-primary" onClick={()=>go("products")}>Explore our creations <ArrowRight size={17}/></button><button className="text-link" onClick={()=>go("story")}>Our story <ArrowRight size={16}/></button></div><div className="hero-note"><span className="note-line"></span><span>Thoughtfully baked · Beautifully served</span></div></div>
        <div className="hero-visual"><img className="hero-main" src={img("photo-1578985545062-69928b1d9587",1100)} alt="Beautiful chocolate celebration cake"/><div className="hero-float hero-float-one"><img src={img("photo-1513104890138-7c749659a591",350)} alt="Fresh pizza"/><span>Made for sharing</span></div><div className="hero-float hero-float-two"><img src={img("photo-1499636136210-6f4ee915583e",300)} alt="Fresh cookies"/></div><div className="hero-stamp">BAKED<br/>FRESH<br/><b>DAILY</b></div></div>
      </section>
      <section className="section category-section"><div className="section-heading"><div><span className="eyebrow">A WORLD OF GOODNESS</span><h2>Explore our <em>creations</em></h2></div><button className="text-link" onClick={()=>go("products")}>View all products <ArrowRight size={16}/></button></div><div className="category-curve">{categories.map((c,i)=><button className={`category-item c${i}`} key={c.name} onClick={()=>{setCategory(c.name);go("products");}}><span className="category-image"><img src={img(c.image,380)} alt={c.name}/></span><strong>{c.name}</strong><small>Discover more</small></button>)}</div></section>
      <section className="section favourites-section"><div className="section-heading"><div><span className="eyebrow">LOVED BY YOU</span><h2>Customer <em>favourites</em></h2></div><button className="text-link" onClick={()=>go("products")}>Shop all favourites <ArrowRight size={16}/></button></div><div className="product-grid">{products.slice(0,4).map(p=><ProductCard key={p.id} product={p}/>)}</div><div className="occasion-banner"><div className="occasion-copy"><span className="eyebrow light">MOMENTS MADE MEMORABLE</span><h2>Every occasion<br/>deserves a <em>little magic.</em></h2><p>From intimate birthdays to grand celebrations, let us make your moments sweeter.</p><button className="btn btn-light" onClick={()=>{setCategory("Wedding Cakes");go("products");}}>Create something special <ArrowRight size={16}/></button></div><img src={img("photo-1535254973040-607b474cb50d",1000)} alt="Elegant wedding cake"/></div><div className="mini-occasions"><button onClick={()=>go("products")}><img src={img("photo-1558636508-e0db3814bd1d",450)} alt="Birthday cake"/><span><b>Birthdays</b><small>Make a wish come true</small></span></button><button onClick={()=>go("products")}><img src={img("photo-1512909006721-3d6018887383",450)} alt="Gift box"/><span><b>Thoughtful gifting</b><small>Share a little happiness</small></span></button></div></section>
      <section className="story-band"><div className="story-image"><img src={img("photo-1509440159596-0249088772ff",900)} alt="Freshly baked bread"/></div><div className="story-text"><span className="eyebrow">A PASSION FOR THE GOOD THINGS</span><h2>A little story,<br/><em>a lot of heart.</em></h2><p>At Bakery Bar, we believe the best memories are made around good food. Every bake begins with thoughtful ingredients, careful hands and a love for bringing people together.</p><button className="text-link" onClick={()=>go("story")}>Get to know us <ArrowRight size={16}/></button></div><div className="promise-panel"><span className="eyebrow light">THE BAKERY BAR PROMISE</span><h2>Goodness in<br/><em>every detail.</em></h2><div className="promise-grid"><div><Sparkles/><b>Crafted with care</b><small>Thoughtful from start to finish</small></div><div><ShieldCheck/><b>Quality ingredients</b><small>Only the good stuff</small></div><div><CakeSlice/><b>Custom creations</b><small>Made for your moments</small></div><div><Truck/><b>Fresh delivery</b><small>Happiness, right to your door</small></div></div></div></section>
      <section className="section testimonials"><div className="center-heading"><span className="eyebrow">KIND WORDS, FULL HEARTS</span><h2>Made sweeter by <em>you.</em></h2><p>A few happy words from our Bakery Bar family.</p></div><div className="review-grid">{[["“The cake was beautiful and tasted even better. Everyone asked where we ordered it from!”","Priya S.","Birthday celebration"],["“Fresh, delicious and beautifully packed. The perfect little treat for our family.”","Arun K.","Regular customer"],["“They understood exactly what we wanted for our special day. Truly lovely work.”","Meera R.","Wedding order"]].map(r=><article className="review-card" key={r[1]}><div className="stars">★★★★★</div><p>{r[0]}</p><b>{r[1]}</b><small>{r[2]}</small></article>)}</div><div className="review-dots"><i className="selected"></i><i></i><i></i></div></section>
      <ContactBlock/>
    </>
  );

  const ContactBlock = () => <section className="contact-section section" id="contact"><div className="contact-copy"><span className="eyebrow">WE'D LOVE TO HEAR FROM YOU</span><h2>Let's make<br/><em>something lovely.</em></h2><p>Have a question or a special request? Drop us a note and we'll be happy to help.</p><div className="contact-detail"><Phone/> <span><b>Call us</b><small>+91 98765 43210</small></span></div><div className="contact-detail"><Mail/> <span><b>Email us</b><small>hello@bakerybar.in</small></span></div><div className="contact-detail"><Clock/> <span><b>Opening hours</b><small>Every day · 9:00 AM – 9:00 PM</small></span></div></div><form className="contact-form" onSubmit={e=>{e.preventDefault();notify("Thanks! Your demo enquiry is ready.");e.target.reset();}}><h3>Send us a message</h3><label>Your name<input required placeholder="How should we call you?"/></label><label>Email address<input type="email" required placeholder="you@example.com"/></label><label>What can we help with?<select defaultValue=""><option value="" disabled>Select an enquiry</option><option>Custom cake</option><option>Product enquiry</option><option>Order support</option><option>Something else</option></select></label><label>Your message<textarea required rows="3" placeholder="Tell us a little more..."/></label><button className="btn btn-primary" type="submit">Send enquiry <ArrowRight size={16}/></button><small className="demo-note">Demo form only — no message is sent.</small></form></section>;

  const ProductsPage = () => {
    let list = products.filter(p => (category==="All" || p.category===category) && `${p.name} ${p.category}`.toLowerCase().includes(search.toLowerCase()));
    if(sort==="Price: low to high") list=[...list].sort((a,b)=>a.price-b.price);
    if(sort==="Price: high to low") list=[...list].sort((a,b)=>b.price-a.price);
    return <main className="page-wrap"><div className="page-intro"><span className="eyebrow">THE GOOD STUFF</span><h1>Our <em>products</em></h1><p>Freshly made favourites for everyday moments and special occasions.</p></div><div className="shop-toolbar"><div className="filter-chips">{["All",...categories.map(c=>c.name)].map(c=><button className={category===c?"active":""} onClick={()=>setCategory(c)} key={c}>{c}</button>)}</div><label className="sort-select">Sort by <select value={sort} onChange={e=>setSort(e.target.value)}><option>Featured</option><option>Price: low to high</option><option>Price: high to low</option></select><ChevronDown size={14}/></label></div><p className="result-count">{list.length} delicious finds</p>{list.length ? <div className="product-grid shop-grid">{list.map(p=><ProductCard key={p.id} product={p}/>)}</div> : <div className="empty-state"><Search/><h3>No treats found</h3><p>Try another search or category.</p><button className="btn btn-primary" onClick={()=>{setSearch("");setCategory("All");}}>Clear filters</button></div>}</main>;
  };

  const ProductPage = () => <main className="page-wrap product-detail"><button className="back-link" onClick={()=>go("products")}><ArrowLeft size={16}/> Back to products</button><div className="detail-layout"><div className="detail-photo"><img src={img(selected.image,1100)} alt={selected.name}/><span className="product-tag">BAKERY BAR FAVOURITE</span></div><div className="detail-copy"><span className="eyebrow">{selected.category.toUpperCase()}</span><h1>{selected.name}</h1><div className="detail-rating"><span className="stars">★★★★★</span> {selected.rating} · Customer favourite</div><strong className="detail-price">{money(selected.price)}</strong><p>{selected.description}</p><div className="detail-option"><b>Choose size</b><div className="option-buttons">{[selected.weight, selected.category==="Cakes"?"1 kg":selected.weight].filter((v,i,a)=>a.indexOf(v)===i).map((v,i)=><button className={weight===v?"chosen":""} key={i} onClick={()=>setWeight(v)}>{v}</button>)}</div></div><div className="detail-option"><b>Quantity</b><div className="quantity-control"><button onClick={()=>setQuantity(q=>Math.max(1,q-1))}><Minus/></button><span>{quantity}</span><button onClick={()=>setQuantity(q=>q+1)}><Plus/></button></div></div><div className="detail-actions"><button className="btn btn-primary" onClick={()=>{addToCart(selected,quantity,weight);go("cart");}}>Add to bag · {money(selected.price*quantity)} <ShoppingBag size={17}/></button><button className="btn btn-outline" onClick={()=>{addToCart(selected,quantity,weight);go("checkout");}}>Buy now</button></div><div className="detail-perks"><span><Truck/> Freshly prepared</span><span><ShieldCheck/> Quality ingredients</span></div><div className="product-note"><b>A little note</b><p>For custom designs, large quantities or specific delivery requests, please contact our team before placing your order.</p></div></div></div><section className="related section"><div className="section-heading"><div><span className="eyebrow">MORE TO LOVE</span><h2>You may also <em>like</em></h2></div></div><div className="product-grid">{products.filter(p=>p.id!==selected.id).slice(0,4).map(p=><ProductCard key={p.id} product={p}/>)}</div></section></main>;

  const CartPage = () => <main className="page-wrap"><div className="page-intro compact"><span className="eyebrow">YOUR LITTLE COLLECTION</span><h1>Shopping <em>bag</em></h1></div>{cart.length===0?<div className="empty-state"><ShoppingBag/>

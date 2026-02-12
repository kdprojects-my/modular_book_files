# Adding the Building Blocks Page

## Step 1: Update the Navigation Tabs

Find this section in your index.html (around line 35):

```html
<nav class="book-nav">
  <div class="book-nav-inner">
    <button class="book-tab active" data-page="cover">Cover</button>
    <button class="book-tab" data-page="intro">Introduction</button>
    <button class="book-tab" data-page="pantry">Pantry & Tricks</button>
    <button class="book-tab" data-page="recipes">Recipes</button>
  </div>
</nav>
```

**REPLACE** with:

```html
<nav class="book-nav">
  <div class="book-nav-inner">
    <button class="book-tab active" data-page="cover">Cover</button>
    <button class="book-tab" data-page="intro">Introduction</button>
    <button class="book-tab" data-page="pantry">Pantry & Tricks</button>
    <button class="book-tab" data-page="building-blocks">Building Blocks</button>
    <button class="book-tab" data-page="recipes">Recipes</button>
  </div>
</nav>
```

## Step 2: Insert the Building Blocks Page

In your index.html, find this line (around line 167):

```html
<!-- ═══════════════════════════════════════════════
     RECIPES INDEX PAGE
     ═══════════════════════════════════════════════ -->
```

**JUST BEFORE** that line, insert the entire contents of `building-blocks-page.html`

## Step 3: Update Introduction Navigation Button (Optional)

If you want the Introduction page to link to Building Blocks instead of directly to Recipes, find this in the Introduction section:

```html
<div class="intro-nav-hint">
  <p>Ready to start cooking?</p>
  <button onclick="goToPage('recipes')">Browse the Recipes →</button>
</div>
```

You can change it to:

```html
<div class="intro-nav-hint">
  <p>Want to learn the foundations first?</p>
  <button onclick="goToPage('building-blocks')">See Building Blocks →</button>
</div>
```

## Step 4: Update Pantry Page Navigation (Optional)

Similarly in the Pantry page, you could change:

```html
<button onclick="goToPage('recipes')">Browse the Recipes →</button>
```

To:

```html
<button onclick="goToPage('building-blocks')">Learn Building Blocks →</button>
```

## Final Tab Order

Your navigation will now be:
1. Cover
2. Introduction  
3. Pantry & Tricks
4. **Building Blocks** ← NEW!
5. Recipes

No JavaScript changes needed - the `goToPage()` function already handles any page with `id="page-{name}"` format!

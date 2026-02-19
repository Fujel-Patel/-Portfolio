# Personalize Your Portfolio

This file contains all the placeholders you need to customize. Replace each section with your real information.

## 📝 Personal Information

### Hero Section (`src/components/ui/HeroSection.tsx`)

```typescript
// Line 42-44 - Welcome text
<h2 className="text-cyan-400 text-lg mb-4 tracking-wider">
  Welcome to my portfolio
</h2>

// Line 47-51 - Your name/title
<h1 className="hero-text text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
  <span className="text-white">YOUR_FIRST_NAME</span>
  <br />
  <span className="text-gradient">YOUR_LAST_NAME</span>
</h1>

// Line 53-55 - Your tagline
<p className="hero-text text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
  YOUR_TAGLINE_HERE - Describe what you do in one sentence
</p>

// Line 63-73 - Social Media Links
// Replace # with your actual profile URLs:
// GitHub: https://github.com/yourusername
// LinkedIn: https://linkedin.com/in/yourusername  
// Twitter: https://twitter.com/yourusername
```

### About Section (`src/components/ui/AboutSection.tsx`)

```typescript
// Line 23-29 - About description
<p className="text-gray-400 text-lg max-w-2xl mx-auto">
  YOUR_BIO_HERE - Write 2-3 sentences about yourself, your experience, 
  and what makes you unique as a developer.
</p>

// Lines 11-26 - Feature Cards
// Customize these to reflect your actual strengths:
const features = [
  {
    icon: Code2,
    title: 'YOUR_STRENGTH_1',  // e.g., 'Full Stack Development'
    description: 'Description of this strength',
  },
  // Add more...
]
```

### Contact Section (`src/components/ui/ContactSection.tsx`)

```typescript
// Lines 43-45 - Update your actual contact info
{[
  { icon: Mail, label: 'Email', value: 'your.email@example.com' },
  { icon: Phone, label: 'Phone', value: 'YOUR_PHONE_NUMBER' },
  { icon: MapPin, label: 'Location', value: 'YOUR_CITY, COUNTRY' },
]}
```

## 🎨 Projects (`src/components/ui/ProjectsSection.tsx`)

Replace the entire `projects` array (lines 5-67) with your real projects:

```typescript
const projects = [
  {
    title: 'PROJECT_NAME',
    description: 'Brief description of the project',
    fullDescription: 'Detailed description (2-3 sentences)',
    tags: ['Tech1', 'Tech2', 'Tech3'],
    technologies: ['Detailed', 'tech', 'stack', 'used'],
    features: [
      'Key feature 1',
      'Key feature 2',
      'Key feature 3',
    ],
    image: 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20',
    githubUrl: 'https://github.com/yourusername/repo',
    demoUrl: 'https://your-demo-link.com',
    timeline: 'X months',
    team: 'Solo/Team of X',
  },
  // Add more projects...
]
```

## 🛠️ Skills (`src/components/ui/SkillsSection.tsx`)

Update the skills array (lines 5-12) with your actual skills:

```typescript
const skills = [
  { name: 'React', level: 95, color: '#61DAFB' },
  { name: 'TypeScript', level: 90, color: '#3178C6' },
  { name: 'Your Skill', level: YOUR_LEVEL, color: '#HEX_COLOR' },
  // Add/remove as needed
]
```

## 🌐 SEO & Meta Tags (`index.html`)

```html
<!-- Line 8 -->
<title>YOUR_NAME | YOUR_TITLE</title>

<!-- Line 11 -->
<meta name="title" content="YOUR_NAME | YOUR_TITLE" />

<!-- Line 12 -->
<meta name="description" content="YOUR_META_DESCRIPTION" />

<!-- Line 15 -->
<meta name="author" content="YOUR_NAME" />

<!-- Open Graph / Facebook (Lines 18-24) -->
<meta property="og:url" content="YOUR_WEBSITE_URL" />
<meta property="og:title" content="YOUR_NAME | YOUR_TITLE" />
<meta property="og:description" content="YOUR_DESCRIPTION" />
<meta property="og:image" content="YOUR_PREVIEW_IMAGE_URL" />

<!-- Twitter (Lines 27-33) -->
<meta property="twitter:url" content="YOUR_WEBSITE_URL" />
<meta property="twitter:title" content="YOUR_NAME | YOUR_TITLE" />
<meta property="twitter:description" content="YOUR_DESCRIPTION" />
<meta property="twitter:image" content="YOUR_PREVIEW_IMAGE_URL" />
```

## 🎨 Colors & Theme

To change the color scheme, edit `src/index.css`:

```css
/* Primary colors */
--color-accent-cyan: #00d4ff;    /* Change this */
--color-accent-magenta: #ff00a0; /* Change this */
--color-accent-purple: #7000ff;  /* Change this */
```

## 📝 Quick Checklist

- [ ] Replace name in Hero section
- [ ] Update tagline
- [ ] Add social media links
- [ ] Write personal bio
- [ ] Add real projects (minimum 3)
- [ ] Update skills list
- [ ] Add contact information
- [ ] Update SEO meta tags
- [ ] Choose your color scheme
- [ ] Add project images/screenshots
- [ ] Configure EmailJS
- [ ] Test contact form

## 💡 Pro Tips

1. **Images**: Replace emoji icons with actual project screenshots
2. **Projects**: Include a mix of personal and professional work
3. **Skills**: Be honest about your proficiency levels
4. **SEO**: Use keywords relevant to your target jobs
5. **Testing**: View on mobile, tablet, and desktop

## 🚀 After Personalization

1. Run `npm run build` to test
2. Check for any errors
3. Deploy to Vercel/Netlify
4. Share your portfolio!

**Need help with any section? Just ask!**

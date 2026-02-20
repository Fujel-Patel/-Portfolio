# 🎨 3D Creative Portfolio

A stunning, interactive 3D portfolio built with React, Three.js, and modern web technologies.

![Portfolio Preview](./screenshot.png)

## ✨ Features

### 🎮 3D Interactive Experience

- **React Three Fiber** powered 3D scene
- Floating animated geometric shapes
- 500-particle background system (reduced to 200 on mobile)
- Bloom post-processing effects
- Dynamic lighting with colored lights

### 🎨 Design

- **Glassmorphism** UI design
- **Cyan-Magenta-Purple** gradient accents
- Smooth scroll with Lenis
- GSAP + Framer Motion animations
- Custom cursor with trail effect (desktop only)

### 📱 Responsive

- Mobile-first responsive design
- Touch-optimized interactions
- Adaptive 3D performance
- Works on all device sizes

### 🛠️ Sections

1. **Hero** - Eye-catching introduction with 3D background
2. **About** - Personal bio with feature cards
3. **Projects** - Portfolio showcase with detail modals
4. **Skills** - Animated progress bars
5. **Blog** - Technical articles and insights
6. **Contact** - Functional contact form with EmailJS

### 🌓 Theme Support

- Dark/Light mode toggle
- Persistent theme preference
- Smooth theme transitions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/your-portfolio.git

# Navigate to project
cd your-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📋 Configuration

### 1. EmailJS Setup (Contact Form)

The contact form uses EmailJS to send emails without a backend.

**Step 1:** Sign up at [EmailJS](https://www.emailjs.com/)

**Step 2:** Create an Email Service (Gmail, Outlook, etc.)

**Step 3:** Create an Email Template:

```
Subject: New Contact Form Message from {{from_name}}

From: {{from_name}} ({{from_email}})
Message:
{{message}}
```

**Step 4:** Get your credentials from the EmailJS dashboard

**Step 5:** Update `src/components/ui/ContactSection.tsx`:

```typescript
emailjs.init('YOUR_PUBLIC_KEY')

await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
  from_name: formData.name,
  from_email: formData.email,
  message: formData.message,
})
```

Detailed guide: [EMAILJS_SETUP.md](./EMAILJS_SETUP.md)

### 2. Personalize Content

Update these files with your information:

- **Hero**: `src/components/ui/HeroSection.tsx`
- **About**: `src/components/ui/AboutSection.tsx`
- **Projects**: `src/components/ui/ProjectsSection.tsx`
- **Skills**: `src/components/ui/SkillsSection.tsx`
- **Contact**: `src/components/ui/ContactSection.tsx`
- **SEO**: `index.html`

Detailed guide: [PERSONALIZATION_GUIDE.md](./PERSONALIZATION_GUIDE.md)

### 3. Color Scheme

Edit `src/index.css` to change colors:

```css
:root {
  --color-accent-cyan: #00d4ff;
  --color-accent-magenta: #ff00a0;
  --color-accent-purple: #7000ff;
}
```

## 🚀 Deployment

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### Option 2: Automated Scripts

**Windows:**

```bash
deploy.bat
```

**Mac/Linux:**

```bash
chmod +x deploy.sh
./deploy.sh
```

### Option 3: Git Integration

1. Push code to GitHub
2. Import repository on [Vercel](https://vercel.com)
3. Auto-deploy on every push!

Detailed guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 📝 Project Structure

```
portfolio/
├── src/
│   ├── components/
│   │   ├── 3d/           # 3D scene components
│   │   ├── ui/           # UI components
│   │   └── layout/       # Layout components
│   ├── hooks/            # Custom React hooks
│   ├── store/            # State management
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── index.html            # HTML template
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite config
└── vercel.json          # Vercel deployment config
```

## 🎨 Customization

### Adding New Projects

Edit `src/components/ui/ProjectsSection.tsx`:

```typescript
const projects = [
  {
    title: 'Your Project',
    description: 'Brief description',
    fullDescription: 'Detailed description...',
    tags: ['React', 'Node.js'],
    technologies: ['Tech1', 'Tech2'],
    features: ['Feature 1', 'Feature 2'],
    githubUrl: 'https://github.com/...',
    demoUrl: 'https://demo.com',
    timeline: '3 months',
    team: 'Solo',
  },
]
```

### Adding Blog Posts

Edit `src/components/ui/BlogSection.tsx`:

```typescript
const blogPosts = [
  {
    id: 1,
    title: 'Your Article Title',
    excerpt: 'Brief summary...',
    content: '<p>Full HTML content...</p>',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Technology',
    tags: ['React', 'Tutorial'],
  },
]
```

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **3D**: Three.js, React Three Fiber, React Three Drei
- **Animations**: GSAP, Framer Motion
- **Styling**: Tailwind CSS
- **Scroll**: Lenis
- **Icons**: Lucide React
- **Build**: Vite
- **Deploy**: Vercel

## 📊 Performance

- ⚡ **Lazy loading** for below-fold sections
- 🎯 **Mobile-optimized** 3D (60% fewer particles)
- 🖼️ **Optimized images** and assets
- 🚀 **Fast build** with Vite
- 📱 **Responsive** across all devices

## 🔒 Security

- Environment variables for sensitive data
- No exposed API keys in code
- HTTPS by default on Vercel
- XSS protection headers

## 🐛 Troubleshooting

**Build fails?**

```bash
# Clear cache
rm -rf node_modules
rm package-lock.json
npm install
```

**3D scene not loading?**

- Check browser console for WebGL errors
- Ensure GPU acceleration is enabled
- Try a different browser

**Contact form not working?**

- Verify EmailJS credentials
- Check browser console for errors
- Ensure form fields are filled

**Custom cursor not showing?**

- Only works on desktop (pointer: fine)
- Hidden on touch devices automatically

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) for 3D graphics
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) for React 3D integration
- [GSAP](https://greensock.com/gsap/) for animations
- [Vercel](https://vercel.com/) for hosting

---

**Enjoy your new portfolio! 🚀**

Built with ❤️ and a lot of ☕

## 📞 Support

Having issues? Check these resources:

- [EmailJS Setup Guide](./EMAILJS_SETUP.md)
- [Personalization Guide](./PERSONALIZATION_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

Or open an issue on GitHub!

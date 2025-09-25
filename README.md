# OTG Ambassador Card Generator

This is a React-based web app that lets users:
- Upload or choose an avatar (face or pre-created avatar)
- Enter a name and role, which are printed at specified locations on a template
- Upload a custom font (with default fallback)
- Download the generated image or share directly to X (Twitter) with a website link

---

## Features

- Canvas rendering with your provided template
- User uploads for avatar and custom fonts
- Pre-created avatars option
- Download as PNG
- Share to X with website link
- Fully responsive

---

## How to run locally

1. Clone this repo
2. `npm install`
3. `npm start`

---

## Additions

- Place your template image in `public/template.png` (replace the green area with transparency)
- Add default font to `public/fonts/`
- Add pre-created avatars to `public/avatars/`
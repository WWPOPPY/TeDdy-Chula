# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# TeDdy-Chula

## Development

```bash
npm install
npm run dev
```

## Verify Before Deploy

```bash
npm run lint
npm run build
npm run preview
```

## Deploy

อัปโหลดทั้งโฟลเดอร์ `dist/` ขึ้นเซิร์ฟเวอร์ (ไม่ใช่ `src/`).

## ทำไม `Go Live` ใช้ไม่ได้กับโค้ดใน `src`

โปรเจกต์นี้เป็น Vite + React ซึ่งต้องมี Vite แปลงโมดูลก่อนรัน  
ถ้าเปิด `index.html` ตรง ๆ ด้วย Live Server (source mode) browser จะเจอ import แบบแพ็กเกจเช่น `react` แล้วขึ้น error `Failed to resolve module specifier`.

ตอนนี้ตั้งค่า Live Server ให้ชี้ไปที่ `dist` ไว้แล้วใน `.vscode/settings.json`  
ดังนั้นลำดับการทดสอบด้วย Go Live คือ:

1. `npm run build`
2. กด `Go Live` (จะเสิร์ฟจาก `dist/`)

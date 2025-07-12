import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './main.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    Hello World
  </StrictMode>
)

export default function enableChii() {
  const script = document.createElement('script');
  script.src = '/chii/target.js';
  document.body.appendChild(script);
}

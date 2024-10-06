export async function handlePushed() {
  const isPreview = process.env.TAG === 'preview';
  console.log(
    'Docker image has been pushed' + isPreview ? ' (preview)' : ' ()'
  );
}

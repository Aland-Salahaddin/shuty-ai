const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuam5kY3NzcHV3ZWR0c2pnZGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0Njg4ODQsImV4cCI6MjA5MzA0NDg4NH0.QuRu2zfRhKEmogwIUqeF40yGkTfl4ZNwQM3_BGI3r5A';
const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString());
console.log('Correct Ref:', payload.ref);

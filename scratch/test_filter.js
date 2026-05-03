
const search = '';
const users = [
  { primaryEmailAddress: { emailAddress: 'test@example.com' }, fullName: 'Test User' },
  { primaryEmailAddress: null, fullName: null }
];

try {
  const filteredUsers = users.filter(u => 
    u.primaryEmailAddress?.emailAddress?.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName?.toLowerCase().includes(search.toLowerCase())
  );
  console.log('Filtered Users:', filteredUsers.length);
} catch (e) {
  console.log('Caught Error:', e.message);
}

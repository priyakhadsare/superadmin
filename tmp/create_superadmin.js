
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function createSuperAdmin() {
  const url = 'https://testing.testing.staffly.space/super-admin/create';
  const payload = {
    name: 'Vipul Patil',
    email: 'vipulpatil@gmail.com',
    phone: '1234567890',
    gender: 'male',
    password: '123456'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error creating super admin:', error);
  }
}

createSuperAdmin();

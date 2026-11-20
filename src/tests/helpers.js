import request from 'supertest';

export const registerAndLogin = async (app, email, password = 'secret123') => {
  await request(app).post('/auth/register').send({ email, password });

  const response = await request(app)
    .post('/auth/login')
    .send({ email, password });

  return response.body.data.accessToken;
};

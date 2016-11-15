import Pet from './models/Pet';
import User from './models/User';

export default async function savaDataInDb(data) {
  try {
    const user = new User(data.user);
    await user.save();
    const promises = data.pets.map(pet => {
      const petData = Object.assign({}, pet, {
        owner: user._id
      }); 
      return new Pet(petData).save();
    })
    const pets = await Promise.all(promises)
    console.log('success');
    return { user, pets };
  } catch(err) {
    console.log('err', err);
    throw err;
  }
}

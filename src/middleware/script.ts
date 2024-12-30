import * as bcrypt from 'bcrypt';
import { connect, model, Schema } from 'mongoose';

// Defina o esquema do usuário
const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
});

const User = model('User', UserSchema);

async function updatePasswords() {
  try {
    await connect(
      'mongodb+srv://vitoriagonzalez:08131625@cluster0.qfg5s.mongodb.net/InternalProject?retryWrites=true&w=majority&appName=Cluster0',
    );

    const users = await User.find();
    for (const user of users) {
      if (!user.password.startsWith('$2b$')) {
        // Verifica se a senha não está criptografada
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        await user.save();
        console.log(`Senha atualizada para o usuário: ${user.email}`);
      }
    }

    console.log('Senhas atualizadas para todos os usuários!');
  } catch (error) {
    console.error('Erro ao atualizar senhas:', error);
  } finally {
    process.exit();
  }
}

updatePasswords();

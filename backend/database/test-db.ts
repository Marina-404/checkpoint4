import client from './db';

async function testConnection() {
  try { 
    // Test de connexion 
    const connection = await client.getConnection();
    console.log('✅ Connexion réussie !');
    
    // Test d'une requête 
    const [rows] = await client.execute('SELECT 1 as test');
    console.log('✅ Requête de test réussie :', rows);
    
    // Vérification que les tables existent
    const [tables] = await client.execute('SHOW TABLES');
    console.log('Tables disponibles :', tables);
    
    connection.release();
    console.log('✅ Test terminé avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur de connexion :', error);
  } finally {
    await client.end();
  }
}

testConnection();
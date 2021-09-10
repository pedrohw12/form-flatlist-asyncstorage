import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';

console.disableYellowBox = true;

const App = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [formData, setFormData] = useState([]);
  const [isRender, setIsRender] = useState(false);

  useEffect(() => {
    async function fetch() {
      const name = await AsyncStorage.getItem('name');
      const email = await AsyncStorage.getItem('email');
      const phone = await AsyncStorage.getItem('phone');

      if (name !== null && email !== null && phone !== null) {
        setName(name);
        setEmail(email);
        setPhone(phone);

        setFormData([...formData, name, email, phone]);
      }
    }

    fetch();
  }, []);

  async function _storeData(data, dataType) {
    try {
      await AsyncStorage.setItem(dataType, data);
    } catch (error) {
      alert('Erro ao salvar info');
    }
  }

  function onEndEditing(dataType) {
    setIsRender(!isRender);

    switch (dataType) {
      case 'name':
        if (name.length < 1) {
          return;
        }
        _storeData(name, dataType);
        setFormData([...formData, name]);
        break;
      case 'email':
        if (email.length < 1) {
          return;
        }
        _storeData(email, dataType);
        setFormData([...formData, email]);
        break;
      default:
        if (phone.length < 1) {
          return;
        }
        _storeData(phone, dataType);
        setFormData([...formData, phone]);
        break;
    }
  }

  async function handleClearForm() {
    await AsyncStorage.clear();
    setFormData([]);
    setIsRender(!isRender);
  }

  function renderItem({item, index}) {
    return (
      <TouchableOpacity style={styles.button} onPress={handleClearForm}>
        <Text
          style={
            index === 0
              ? styles.btnTxtName
              : index === 1
              ? styles.btnTxtEmail
              : styles.btnTxtPhone
          }
          key={String(item)}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          onChangeText={txt => setName(txt)}
          onEndEditing={() => onEndEditing('name')}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={txt => setEmail(txt)}
          onEndEditing={() => onEndEditing('email')}
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          onChangeText={txt => setPhone(txt)}
          onEndEditing={() => onEndEditing('phone')}
        />
      </View>
      <FlatList
        data={formData}
        extraData={isRender}
        keyExtractor={item => String(item)}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    margin: 5,
    padding: 10,
  },
  button: {
    backgroundColor: '#d3f4',
    margin: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    height: 60,
  },
  btnTxtName: {
    fontSize: 13,
  },
  btnTxtEmail: {
    fontSize: 20,
  },
  btnTxtPhone: {
    fontSize: 27,
  },
});

export default App;

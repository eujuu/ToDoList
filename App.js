import React from 'react';
import {ScrollView, StyleSheet, Text, View , StatusBar, TextInput, Dimensions,AsyncStorage} from 'react-native';
import Todo from "./Todo";
import {AppLoading} from "expo";
import uuidv1 from "uuid/v1";
const {height, width} = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newToDo: "",
    loadedToDos: false,
    toDos: {}
  };
  componentDidMount = () => {
    this._loadedToDos();
  }
  render() {
    const { newToDo , loadedToDos, toDos} = this.state;
   
    if(!loadedToDos){
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle = "light-content" />
        <Text style = {styles.title}>To Do</Text>
        <View style={styles.card} >
         <TextInput 
          style={styles.input} 
          placeholder={"New To Do"}  
          value = {newToDo} 
          onChangeText={this._crontollNewToDo}
          placeholderTextColor={"#999"}
          returnKeyType ={"done"}
          autoCorrect ={false}
          onSubmitEditing={this._addToDo}
         />
         <ScrollView conentContainerStyle = {styles.toDos}>
            {Object.values(toDos)
              .reverse()
              .map(toDo => (
              <Todo
               key={toDo.id} 
               deleteToDo = { this._deleteToDo}
               uncompleteToDo = {this._uncompleteToDo}
               completeToDo = {this._completeToDo}
               updateToDo = {this._updateToDo}
               {...toDo} 
               />
               ))}
         </ScrollView>
        </View>
      </View>
    );
  }
  _crontollNewToDo = text => {
    this.setState({
      newToDo: text
    });
  };
  _loadedToDos = async () => {
    const toDos = await AsyncStorage.getItem("toDos");
    const parsedToDos = JSON.parse(toDos);
    this.setState({
      loadedToDos: true,
      toDos: parsedToDos
    });
  };
  _addToDo = () => {
    const {newToDo} = this.state;
    if(newToDo!=""){
      this.setState(prevState => {
        const ID = uuidv1();
        const newTodoObject = {
          [ID]: {
            id : ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newToDo: "",
          toDos: {
            ...prevState.toDos,
            ...newTodoObject
          }
        };
        this._saveToDos(newState.toDos);
        return { ... newState };
      });  
    }
  };
  _deleteToDo = id => {
    this.setState (prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      };
      this._saveToDos(newState.toDos);
      return { ...newState};
    });
  };
  _uncompleteToDo = id => {
    this.setState(prevState =>{
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState};
    });
  };
  _completeToDo = id => {
    this.setState(prevState =>{
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState};
    });
  };
  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            text: text
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState};
    });
  };
  _saveToDos = (newToDos) => {
    const saveToDos =AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3C4FF',
    alignItems: 'center'
    
  },
  title: {
    color: "white",
    fontSize: 30,
    paddingTop: 70,
    fontWeight: "200",
    paddingBottom: 30
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius : 10,
    borderTopRightRadius: 10,
    elevation: 3
  },
  input: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 20,
  },
  toDos:{
    alignItems: "center"
  },
});

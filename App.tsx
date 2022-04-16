/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import withObservables from '@nozbe/with-observables';
import {database} from './src/model/index.native';
import {descend, prop, sortWith} from 'ramda';
import Tasks from './src/model/Task';
import Todos from './src/components/Todos';

const sortedTasks = sortWith([descend<Tasks>(prop('created_at'))]);

const App = ({tasks}: {tasks: Tasks[]}) => {
  const [todo, setTodo] = React.useState('');
  const [focus, setFocus] = React.useState(false);
  return (
    <ScrollView>
      <View style={{padding: 20}}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: '200',
            fontSize: 40,
          }}>
          Tasks
        </Text>
        <TextInput
          label="Enter Task"
          mode="outlined"
          value={todo}
          style={{
            marginVertical: 10,
          }}
          outlineColor="rgba(0, 0, 0, 0.04)"
          onChangeText={text => setTodo(text)}
          onFocus={() => {
            setFocus(true);
          }}
          onBlur={() => {
            setFocus(false);
          }}
          right={
            <TextInput.Icon
              name="plus-circle"
              color={focus ? '#035afc' : 'rgba(0, 0, 0, 0.54)'}
              onPress={async () => {
                if (!todo.trim()) return;
                await database.write(async () => {
                  await database.get('tasks').create(task => {
                    task.title = todo;
                    task.isCompleted = false;
                    task.created_at = new Date();
                  });
                });
                setTodo('');
              }}
            />
          }
        />
        {sortedTasks(tasks).map((task, index: number) => (
          <Todos task={task} key={index} />
        ))}
      </View>
    </ScrollView>
  );
};

const enhance = withObservables([], () => ({
  tasks: database.collections.get('tasks').query().observe(),
}));

const EnhancedComment = enhance(App);
export default EnhancedComment;

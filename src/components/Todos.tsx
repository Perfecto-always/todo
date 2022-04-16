import * as React from 'react';
import {Checkbox, IconButton} from 'react-native-paper';
import {database} from '../model/index.native';
import Tasks from '../model/Task';
import withObservables from '@nozbe/with-observables';
import {List} from 'react-native-paper';

const Todos = ({task}: {task: Tasks}) => {
  return (
    <List.Item
      title={task.title}
      style={{
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        borderColor: 'rgba(0, 0, 0, 0.04)',
        padding: 20,
      }}
      titleStyle={{
        textDecorationLine: task.isCompleted ? 'line-through' : 'none',
      }}
      left={_ => (
        <Checkbox status={task.isCompleted ? 'checked' : 'unchecked'} />
      )}
      onPress={async () => {
        await task.completed();
      }}
      right={props => (
        <IconButton
          {...props}
          icon="delete"
          onPress={async () => {
            await database.write(async () => {
              await task.delete();
            });
          }}
        />
      )}
    />
  );
};

const enhance = withObservables([], () => ({
  tasks: database.collections
    .get('tasks')
    .query()
    .observeWithColumns(['is_completed']),
}));
const EnhancedComment = enhance(Todos);
export default EnhancedComment;

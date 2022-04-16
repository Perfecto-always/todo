import {Model, Q} from '@nozbe/watermelondb';
import {text, date, field, writer} from '@nozbe/watermelondb/decorators';
export default class Tasks extends Model {
  static table = 'tasks';

  @text('title') title: string;
  @field('is_completed') isCompleted: boolean;
  @date('created_at') created_at: Date;

  async delete() {
    await this.collections
      .get('tasks')
      .query(Q.where('id', this.id))
      .destroyAllPermanently();
  }

  // @writer async addTask(title: string) {
  //   const newTasks = await this.collections.get('tasks').create(task => {
  //     task.title = title;
  //     task.isCompleted = false;
  //     task.created_at = new Date();
  //   });

  //   return newTasks;
  // }

  @writer async completed() {
    await this.update(task => {
      task.isCompleted = !task.isCompleted;
    });
  }
}

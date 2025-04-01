import { Model, mixin,compose } from 'objection';
import { KnexInstance } from '..';
import guid from 'objection-guid';
import visibility from 'objection-visibility';
import { DBErrors } from 'objection-db-errors';

//@ts-ignore
import objection_unique from 'objection-unique';

Model.knex(KnexInstance);

export const modelUuid = guid();

// Import the plugin.
export const modelUnique = objection_unique({
  fields: ['email'],
  identifiers: ['id'],
});

const mixins = compose(visibility, DBErrors, modelUuid)

// export class baseModel extends mixins(Model) {
//   static query(...args: any) {
//     return super.query(...args).throwIfNotFound();
//   }

  
// }

export default mixins;

// export type Db<PropertyType extends object = object> = Model & PropertyType;
// export const Db: typeof Model & (new <PropertyType extends object = object>() => Db<PropertyType>) = Model as any; // type cast here because it'll complain otherwise
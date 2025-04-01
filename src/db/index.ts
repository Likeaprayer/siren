import Knex from 'knex'
import config from './knexfile'

export const KnexInstance = Knex(config[process.env.NODE_ENV!])
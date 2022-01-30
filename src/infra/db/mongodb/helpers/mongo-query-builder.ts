export class MongoQueryBuilder {
  private readonly query = []

  private addStep (step: string, data: object): MongoQueryBuilder {
    this.query.push({
      [step]: data
    })
    return this
  }

  match (data: object): MongoQueryBuilder {
    return this.addStep('$match', data)
  }

  group (data: object): MongoQueryBuilder {
    return this.addStep('$group', data)
  }

  unwind (data: object): MongoQueryBuilder {
    return this.addStep('$unwind', data)
  }

  lookup (data: object): MongoQueryBuilder {
    return this.addStep('$lookup', data)
  }

  project (data: object): MongoQueryBuilder {
    return this.addStep('$project', data)
  }

  sort (data: object): MongoQueryBuilder {
    return this.addStep('$sort', data)
  }

  build (): object[] {
    return this.query
  }
}

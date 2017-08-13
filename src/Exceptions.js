import ExtendableError from '../lib/ExtendableError'

export class DrinksNotOutstanding extends ExtendableError {}
export class FoodNotOutstanding extends ExtendableError {}
export class FoodNotPrepared extends ExtendableError {}
export class MustPayEnough extends ExtendableError {}
export class TabHasUnservedItems extends ExtendableError {}
export class TabNotOpen extends ExtendableError {}
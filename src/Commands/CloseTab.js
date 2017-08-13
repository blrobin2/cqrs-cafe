/**
 * CloseTab
 */
export default class CloseTab {
  /**
   * Creates a new CloseTab command
   * 
   * @param {Object} closeTab - The CloseTab object
   * @param {GUID} closeTab.id - The tab ID
   * @param {Number} closeTab.amountPaid - The amount paid for the tab
   */
  constructor({ id, amountPaid }) {
    this.id = id
    this.amountPaid = amountPaid
  }
}

import { NightwatchBrowser } from 'nightwatch'
import EventEmitter from "events"

class SelectContract extends EventEmitter {
  command (this: NightwatchBrowser, contractName: string): NightwatchBrowser {
    this.api.perform((done) => {
      selectContract(this.api, contractName, () => {
        done()
        this.emit('complete')
      })
    })
    return this
  }
}

function selectContract (browser: NightwatchBrowser, contractName: string, callback: VoidFunction) {
  getCurrentValue(browser, (result) => {
    if (result.value !== contractName) {
      browser.setValue('#runTabView select[class^="contractNames"]', contractName)
    }
    callback()
  })
}

function getCurrentValue (api, callback) {
  api.execute(function () {
    const elem: any =  document.getElementById('#runTabView select[class^="contractNames"]')
    return elem.options[elem.selectedIndex].value
  }, [], (result) => {
    console.log(result)
    callback(result)
  })
}

module.exports = SelectContract

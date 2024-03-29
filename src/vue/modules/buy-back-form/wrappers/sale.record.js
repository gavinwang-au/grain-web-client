import _get from 'lodash/get'

const STATES = {
  Open: 1,
  Closed: 2,
  Canceled: 4,
  Promotion: 8,
  Voting: 16,
}

export class SaleRecord {
  constructor (record) {
    this._record = record

    this.id = record.id
    this.owner = _get(record, 'ownerId')
    this.baseAsset = _get(record, 'baseAsset')
    this.defaultQuoteAsset = _get(record, 'defaultQuoteAsset')
    this.quoteAssets = _get(record, 'quoteAssets') || []
    this.baseHardCap = _get(record, 'baseHardCap')
    this.startTime = _get(record, 'startTime')
    this.endTime = _get(record, 'endTime')
    this.softCap = _get(record, 'softCap')
    this.hardCap = _get(record, 'hardCap')
    this.currentCap = _get(record, 'currentCap')

    this.state = _get(record, 'state')
    this.stateValue = _get(record, 'state.value')
    this.stateStr = _get(record, 'state.name')

    this.details = _get(this._record, 'details')
    this.name = _get(record, 'details.name')
    this.description = _get(record, 'details.description')
    this.shortDescription = _get(record, 'details.shortDescription')
    this.youtubeVideoId = _get(record, 'details.youtubeVideoId')
    this.logo = _get(this._record, 'details.logo')
    this.logoKey = _get(this._record, 'details.logo.key')
    this.logoName = _get(this._record, 'details.logo.name')
    this.logoType = _get(this._record, 'details.logo.type')
  }

  /** URLs **/

  get youtubeVideoUrl () {
    if (this.youtubeVideoId) {
      return `https://www.youtube.com/watch?v=${this.youtubeVideoId}`
    } else {
      return ''
    }
  }

  /** quote assets: **/

  get quoteAssetCodes () {
    return this.quoteAssets.map(asset => asset.asset)
  }

  get quoteAssetPrices () {
    return this.quoteAssets.reduce(
      (prices, asset) => {
        prices[asset.asset] = asset.price; return prices
      }, {})
  }

  get currentCaps () {
    return this.quoteAssets.reduce(
      (caps, asset) => {
        caps[asset.asset] = asset.currentCap; return caps
      }, {})
  }

  get totalCurrentCaps () {
    return this.quoteAssets.reduce(
      (caps, asset) => {
        caps[asset.asset] = asset.totalCurrentCap; return caps
      }, {})
  }

  get hardCaps () {
    return this.quoteAssets.reduce(
      (caps, asset) => {
        caps[asset.asset] = asset.hardCap; return caps
      }, {})
  }

  get isClosed () { return this._isInState(STATES.Closed) }
}

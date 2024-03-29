import _get from 'lodash/get'
import { MathUtil } from '@/js/utils'

export class LimitsRecord {
  constructor (record = {}, details) {
    this._record = record

    this.assetCode =
      _get(record, 'asset.id') ||
      _get(record, 'statistics.assetCode') ||
      details.assetCode ||
      null

    this.annualOut = _get(record, 'annualOut') || null
    this.dailyOut = _get(record, 'dailyOut') || null
    this.weeklyOut = _get(record, 'weeklyOut') || null
    this.monthlyOut = _get(record, 'monthlyOut') || null

    this.statsOpType =
      _get(record, 'statsOpType') ||
      _get(record, 'statistics.statsOpType') ||
      details.statsOpType ||
      null

    this.id = _get(record, 'id') || '0'
  }

  get annualLeft () {
    const annualOutcome = _get(this._record, 'statistics.annualOutcome')
    if (!annualOutcome) {
      return this.annualOut
    }

    return MathUtil.subtract(this.annualOut, annualOutcome)
  }

  get dailyLeft () {
    const dailyOutcome = _get(this._record, 'statistics.dailyOutcome')
    if (!dailyOutcome) {
      return this.dailyOut
    }

    return MathUtil.subtract(this.dailyOut, dailyOutcome)
  }

  get weeklyLeft () {
    const weeklyOutcome = _get(this._record, 'statistics.weeklyOutcome')
    if (!weeklyOutcome) {
      return this.weeklyOut
    }

    return MathUtil.subtract(this.weeklyOut, weeklyOutcome)
  }

  get monthlyLeft () {
    const monthlyOutcome = _get(this._record, 'statistics.monthlyOutcome')
    if (!monthlyOutcome) {
      return this.monthlyOut
    }

    return MathUtil.subtract(this.monthlyOut, monthlyOutcome)
  }
}

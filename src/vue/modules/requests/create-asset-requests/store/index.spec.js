import {
  createAssetRequestsModule,
  mutations,
  getters,
  actions,
} from './index'
import { types } from './types'

import { Wallet, base } from '@tokend/js-sdk'

import { CreateAssetRequest } from '../wrappers/create-asset-request'

import { api, useWallet } from '@/api'

describe('create-asset-requests.module', () => {
  describe('vuex types', () => {
    const getModuleKeys = (module) => {
      return Object.keys({
        ...module.actions,
        ...module.mutations,
        ...module.getters,
      })
    }

    it('every entity in module should be mentioned in vuex-types', () => {
      for (const key of getModuleKeys(createAssetRequestsModule)) {
        expect(types).to.have.property(key)
      }
    })

    it('every key described in vuex-types should be a real vuex-entity', () => {
      const moduleKeys = [
        ...getModuleKeys(createAssetRequestsModule),
      ]

      for (const key of Object.keys(types)) {
        expect(moduleKeys).to.include(key)
      }
    })
  })

  describe('mutations', () => {
    it('SET_REQUESTS should properly modify state', () => {
      const state = {
        requests: [],
      }
      const requests = [
        { id: '1' },
        { id: '2' },
      ]

      mutations[types.SET_REQUESTS](state, requests)

      expect(state).to.deep.equal({
        requests: [
          { id: '1' },
          { id: '2' },
        ],
      })
    })

    it('CONCAT_REQUESTS should properly modify state', () => {
      const state = {
        requests: [
          { id: '1' },
          { id: '2' },
        ],
      }
      const requests = [
        { id: '3' },
        { id: '4' },
      ]

      mutations[types.CONCAT_REQUESTS](state, requests)

      expect(state).to.deep.equal({
        requests: [
          { id: '1' },
          { id: '2' },
          { id: '3' },
          { id: '4' },
        ],
      })
    })

    it('SET_KYC_REQUIRED_ASSET_TYPE should properly modify state', () => {
      const state = {
        kycRequiredAssetType: null,
      }

      mutations[types.SET_KYC_REQUIRED_ASSET_TYPE](state, 1)

      expect(state).to.deep.equal({ kycRequiredAssetType: 1 })
    })
  })

  describe('actions', () => {
    const wallet = new Wallet(
      'test@mail.com',
      'SCPIPHBIMPBMGN65SDGCLMRN6XYGEV7WD44AIDO7HGEYJUNDKNKEGVYE',
      'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
      '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c'
    )

    let store

    beforeEach(() => {
      store = {
        state: {},
        rootGetters: {
          accountId: 'SOME_ACCOUNT_ID',
        },
        commit: sinon.stub(),
        dispatch: sinon.stub(),
      }

      api.useBaseURL('https://test.api.com')
      useWallet(wallet)
    })

    afterEach(() => {
      sinon.restore()
    })

    describe('LOAD_REQUESTS', () => {
      it('calls api.getWithSignature method with provided params', async () => {
        sinon.stub(api, 'getWithSignature').resolves()

        await actions[types.LOAD_REQUESTS]({
          rootGetters: { accountId: 'SOME_ACCOUNT_ID' },
        })

        expect(api.getWithSignature)
          .to.have.been.calledOnceWithExactly(
            '/v3/create_asset_requests',
            {
              page: {
                order: 'desc',
              },
              filter: {
                requestor: 'SOME_ACCOUNT_ID',
              },
              include: ['request_details'],
            }
          )

        api.getWithSignature.restore()
      })
    })

    describe('LOAD_KYC_REQUIRED_ASSET_TYPE', () => {
      it('properly commit its set of mutations', async () => {
        sinon.stub(api, 'get').resolves({
          data: { value: { u32: 1 } },
        })

        const expectedMutations = {
          [types.SET_KYC_REQUIRED_ASSET_TYPE]: 1,
        }

        await actions[types.LOAD_KYC_REQUIRED_ASSET_TYPE](store)

        expect(store.commit.args)
          .to.deep.equal(Object.entries(expectedMutations))

        api.get.restore()
      })
    })

    describe('CANCEL_REQUEST', () => {
      beforeEach(() => {
        sinon.stub(api, 'postOperations').resolves()
      })

      afterEach(() => {
        api.postOperations.restore()
      })

      it('calls base.ManageAssetBuilder.cancelAssetRequest with provided params', async () => {
        sinon.stub(base.ManageAssetBuilder, 'cancelAssetRequest')

        await actions[types.CANCEL_REQUEST]({}, '1')

        expect(base.ManageAssetBuilder.cancelAssetRequest)
          .to.have.been.calledOnceWithExactly({
            requestID: '1',
          })

        base.ManageAssetBuilder.cancelAssetRequest.restore()
      })

      it('calls api.postOperations with correct params', async () => {
        await actions[types.CANCEL_REQUEST]({}, '1')

        expect(api.postOperations).to.have.been.calledOnce
      })
    })
  })

  describe('getters', () => {
    it('requests', () => {
      const state = {
        requests: [
          { id: '1' },
          { id: '2' },
        ],
      }

      expect(getters[types.requests](state))
        .to.deep.equal([
          new CreateAssetRequest({ id: '1' }),
          new CreateAssetRequest({ id: '2' }),
        ])
    })

    it('kycRequiredAssetType', () => {
      const state = { kycRequiredAssetType: 1 }

      expect(getters[types.kycRequiredAssetType](state))
        .to.equal(1)
    })
  })
})

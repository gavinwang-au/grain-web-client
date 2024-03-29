import { vueRoutes } from '@/vue-router/routes'

import { MovementsHistoryModule } from '@modules/movements-history/module'
import { MovementsHistoryPageModule } from '@/vue/pages/movements-page-module'
import { DashboardPageModule } from '@/vue/pages/dashboard-page-module'
import { FeesPageModule } from '@/vue/pages/fees-page-module'
import { FeesModule } from '@modules/fees/module'
import { IssuancePageModule } from '@/vue/pages/issuance-page-module'
import { IssuanceExplorerModule } from '@modules/issuance-explorer/module'
import { TradePageModule } from '@/vue/pages/trade-page-module'
import { LimitsPageModule } from '@/vue/pages/limits-page-module'
import { RequestsPageModule } from '@/vue/pages/requests-page-module'
import { SettingsPageModule } from '@/vue/pages/settings-page-module'
import { AssetCreationRequestsPageModule } from '@/vue/pages/asset-creation-requests-page'
import { CreateAssetRequestsModule } from '@/vue/modules/requests/create-asset-requests/module'
import { AssetUpdateRequestsPageModule } from '@/vue/pages/asset-update-requests-page'
import { UpdateAssetRequestsModule } from '@/vue/modules/requests/update-asset-requests/module'
import { SaleCreationRequestsPageModule } from '@/vue/pages/sale-creation-requests-page'
import { CreateSaleRequestsModule } from '@/vue/modules/requests/create-sale-requests/module'
import { PreIssuanceRequestsPageModule } from '@/vue/pages/pre-issuance-requests-page'
import { PreIssuanceRequestsModule } from '@/vue/modules/requests/pre-issuance-requests/module'
import { IncomingWithdrawalRequestsPageModule } from '@/vue/pages/incoming-withdrawal-requests-page'
import { IncomingWithdrawalRequestsModule } from '@/vue/modules/requests/incoming-withdrawal-requests/module'
import { VerificationPageModule } from '@/vue/pages/verification-page-module'
import { VerificationGeneralAdvancedPageModule } from '@/vue/pages/verification-general-advanced-page-module'
import { VerificationFundAdvancedPageModule } from '@/vue/pages/verification-fund-advanced-page-module'
import { VerificationCorporatePageModule } from '@/vue/pages/verification-corporate-page-module'
import { SecurityPageModule } from '@/vue/pages/security-page-module'
import { ShowAccountIdPseudoModule } from '@/modules-arch/pseudo-modules/show-account-id-pseudo-module'
import { ChangePasswordPseudoModule } from '@/modules-arch/pseudo-modules/change-password-pseudo-module'
import { ShowSeedPseudoModule } from '@/modules-arch/pseudo-modules/show-seed-pseudo-module'
import { IssuanceFormModule } from '@/vue/modules/issuance-form/module'
import { PreIssuanceFormModule } from '@/vue/modules/pre-issuance-form/module'
import { TransferDrawerPseudoModule } from '@/modules-arch/pseudo-modules/transfer-drawer-pseudo-module'
import { DashboardChartPseudoModule } from '@/modules-arch/pseudo-modules/dashboard-chart-pseudo-module'
import { CoinpaymentsDepositModule } from '@/vue/modules/coinpayments-deposit/module'
import { MovementsTopBarModule } from '@modules/movements-top-bar/module'
import { WithdrawalDrawerPseudoModule } from '@/modules-arch/pseudo-modules/withdrawal-drawer-pseudo-module'
import { DepositFormPseudoModule } from '@/modules-arch/pseudo-modules/deposit-form-pseudo-module'
import { ShowNetworkPassphrasePseudoModule } from '@/modules-arch/pseudo-modules/show-network-passphrase-pseudo-module'

import { VerificationGeneralFormModule } from '@/vue/modules/verification/general-form/module'
import { VerificationFundFormModule } from '@/vue/modules/verification/fund-form/module'
import { AssetsPageModule } from '@/vue/pages/assets-page-module'
import { AssetExplorerPageModule } from '@/vue/pages/asset-explorer-page'
import { AssetExplorerModule } from '@/vue/modules/assets/asset-explorer/module'
import { BalancesPageModule } from '@/vue/pages/balances-page'
import { BalanceExplorerModule } from '@/vue/modules/assets/balance-explorer/module'
import { CreateAssetFormModule } from '@/vue/modules/create-asset-form/module'

export default {
  pages: [
    new DashboardPageModule(
      {
        routerEntry: {
          path: '/dashboard',
          name: vueRoutes.dashboard.name,
          meta: { pageNameTranslationId: 'pages-names.dashboard' },
        },
        menuButtonTranslationId: 'pages-names.dashboard',
        menuButtonMdiName: 'view-dashboard',
        submodules: [
          new MovementsHistoryModule(),
          new WithdrawalDrawerPseudoModule(),
          new IssuanceFormModule({
            isCorporateOnly: true,
          }),
          new TransferDrawerPseudoModule(),
          new DashboardChartPseudoModule(),
        ],
      },
    ),

    new MovementsHistoryPageModule(
      {
        routerEntry: {
          path: '/movements',
          name: vueRoutes.movements.name,
          meta: { pageNameTranslationId: 'pages-names.movements' },
        },
        menuButtonTranslationId: 'pages-names.movements',
        menuButtonMdiName: 'menu',
        submodules: [
          new MovementsHistoryModule(),
          new MovementsTopBarModule({
            submodules: [
              new WithdrawalDrawerPseudoModule(),
              new DepositFormPseudoModule({
                submodules: [new CoinpaymentsDepositModule()],
              }),
              new TransferDrawerPseudoModule(),
            ],
          }),
        ],
      },
    ),

    new AssetsPageModule(
      {
        routerEntry: {
          path: '/assets',
          name: vueRoutes.assets.name,
        },
        menuButtonTranslationId: 'pages-names.assets',
        menuButtonMdiName: 'coins',
        isAutoRedirectToFirstChild: true,
        submodules: [
          new AssetExplorerPageModule({
            routerEntry: {
              path: '/assets/explore',
              name: vueRoutes.assetsExplore.name,
              meta: { pageNameTranslationId: 'pages-names.assets' },
            },
            submodules: [
              new AssetExplorerModule(),
            ],
          }),
          new BalancesPageModule({
            routerEntry: {
              path: '/assets/balances',
              name: vueRoutes.balances.name,
              meta: { pageNameTranslationId: 'pages-names.assets' },
            },
            submodules: [
              new BalanceExplorerModule(),
            ],
          }),
          new CreateAssetFormModule({
            isCorporateOnly: true,
          }),
        ],
      },
    ),

    new RequestsPageModule(
      {
        routerEntry: {
          path: '/requests',
          name: vueRoutes.requests.name,
          meta: { pageNameTranslationId: 'pages-names.requests' },
        },
        isCorporateOnly: true,
        menuButtonTranslationId: 'pages-names.requests',
        menuButtonMdiName: 'book-open-variant',
        isAutoRedirectToFirstChild: true,
        submodules: [
          new AssetCreationRequestsPageModule({
            routerEntry: {
              path: '/requests/asset-creation',
              name: vueRoutes.assetCreationRequests.name,
            },
            submodules: [
              new CreateAssetRequestsModule(),
            ],
          }),
          new AssetUpdateRequestsPageModule({
            routerEntry: {
              path: '/requests/asset-update',
              name: vueRoutes.assetUpdateRequests.name,
            },
            submodules: [
              new UpdateAssetRequestsModule(),
            ],
          }),
          new SaleCreationRequestsPageModule({
            routerEntry: {
              path: '/requests/sale-creation',
              name: vueRoutes.saleCreationRequests.name,
            },
            submodules: [
              new CreateSaleRequestsModule(),
            ],
          }),
          new PreIssuanceRequestsPageModule({
            routerEntry: {
              path: '/requests/pre-issuance-upload',
              name: vueRoutes.preIssuanceUploadRequests.name,
            },
            submodules: [
              new PreIssuanceRequestsModule(),
            ],
          }),
          new IncomingWithdrawalRequestsPageModule({
            routerEntry: {
              path: '/requests/incoming-withdrawal',
              name: vueRoutes.incomingWithdrawalRequests.name,
            },
            submodules: [
              new IncomingWithdrawalRequestsModule(),
            ],
          }),
        ],
      },
    ),

    new IssuancePageModule(
      {
        routerEntry: {
          path: '/issuance',
          name: vueRoutes.issuance.name,
          meta: { pageNameTranslationId: 'pages-names.issuance' },
        },
        isCorporateOnly: true,
        menuButtonTranslationId: 'pages-names.issuance',
        menuButtonMdiName: 'poll',
        submodules: [
          new IssuanceExplorerModule(),
          new IssuanceFormModule({
            isCorporateOnly: true,
          }),
          new PreIssuanceFormModule({
            isCorporateOnly: true,
          }),
        ],
      },
    ),

    new TradePageModule(
      {
        routerEntry: {
          path: '/trade',
          name: vueRoutes.trade.name,
          meta: { pageNameTranslationId: 'pages-names.trade' },
          redirect: vueRoutes.tradeExchange,
          children: [
            // Carefully: have some issues because of is-loading prop provided
            // to children from parent component. Leave it lke that for now
            {
              path: '/trade/exchange',
              name: vueRoutes.tradeExchange.name,
              component: _ => import('@/vue/pages/TradeExchange'),
            },
            {
              path: '/trade/my-orders',
              name: vueRoutes.tradeUserOffers.name,
              component: _ => import('@/vue/pages/TradeUserOffers'),
            },
          ],
        },
        menuButtonTranslationId: 'pages-names.trade',
        menuButtonMdiName: 'finance',
      },
    ),

    new LimitsPageModule(
      {
        routerEntry: {
          path: '/limits',
          name: vueRoutes.limits.name,
          meta: { pageNameTranslationId: 'pages-names.limits' },
        },
        menuButtonTranslationId: 'pages-names.limits',
        menuButtonMdiName: 'poll-box',
      },
    ),

    new SettingsPageModule(
      {
        routerEntry: {
          path: '/settings',
          name: vueRoutes.settings.name,
          meta: { pageNameTranslationId: 'pages-names.settings' },
        },
        menuButtonTranslationId: 'pages-names.settings',
        menuButtonMdiName: 'account-settings',
        menuSectionTranslationId: 'sidebar.section-account',
        isAutoRedirectToFirstChild: true,
        submodules: [
          new VerificationPageModule({
            routerEntry: {
              path: '/settings/verification',
              name: vueRoutes.verification.name,
            },
            submodules: [
              new VerificationGeneralAdvancedPageModule({
                routerEntry: {
                  path: '/settings/verification/general',
                  name: vueRoutes.verificationGeneral.name,
                },
                submodules: [
                  new VerificationGeneralFormModule(),
                ],
              }),
              new VerificationCorporatePageModule({
                routerEntry: {
                  path: '/settings/verification/corporate',
                  name: vueRoutes.verificationCorporate.name,
                },
              }),
              new VerificationFundAdvancedPageModule({
                routerEntry: {
                  path: '/settings/verification/fund',
                  name: vueRoutes.verificationFund.name,
                },
                submodules: [
                  new VerificationFundFormModule(),
                ],
              }),
            ],
          }),

          new SecurityPageModule({
            routerEntry: {
              path: '/settings/security',
              name: vueRoutes.security.name,
            },
            submodules: [
              new ChangePasswordPseudoModule(),
              new ShowAccountIdPseudoModule(),
              new ShowSeedPseudoModule(),
              new ShowNetworkPassphrasePseudoModule(),
            ],
          }),
        ],
      }
    ),

    new FeesPageModule(
      {
        routerEntry: {
          path: '/fees',
          name: vueRoutes.fees.name,
          meta: { pageNameTranslationId: 'pages-names.fees' },
        },
        menuButtonTranslationId: 'pages-names.fees',
        menuButtonMdiName: 'flash',
        submodules: [
          new FeesModule(),
        ],
      },
    ),
  ],
}

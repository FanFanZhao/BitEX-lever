import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import homeContent from '@/view/homeContent'
import dealCenter from '@/components/dealCenter'
import fiatradCenter from '@/components/fiatradCenter'
import payOpts from '@/view/payOpts'
import userSetting from '@/components/userSetting'
import c2c from '@/components/c2c'
import c2cOrder from '@/view/c2c/c2cOrder'
import c2cRelease from '@/view/c2c/c2cRelease'
import c2cTrade from '@/view/c2c/c2cTrade'
import c2cDetail from '@/view/c2c/c2cDetail'
import leverdealCenter from '@/components/lever_dealCenter'
import login from '@/components/login'
import register from '@/components/register'
import account from '@/components/account'
import accountCenter from '@/view/accountCenter'
import accountEntrust from '@/view/accountEntrust'
import accountSet from '@/view/accountSet'
import authentication from '@/view/authentication'
import payment from '@/view/payment'
import accountMessage from '@/view/accountMessage'
import setCash from '@/components/setCash'
import recharge from '@/view/recharge'
import rechargeMoney from '@/view/rechargeMoney'
import coinRecord from '@/view/coinRecord'
import noticeList from '@/components/noticeList'
import noticeDetail from '@/components/noticeDetail'
import aceite from '@/view/aceite'
import region from '@/view/region'
import chargeRecord from '@/view/chargeRecord'
import new_account from '@/components/new_account'
import finance from '@/view/accounts/finance'
import transfer from '@/view/accounts/transfer'
import lever from '@/view/accounts/lever'
import finanrec from '@/view/accounts/finanrec'
import manger from '@/view/accounts/lever_manger'
import legal from '@/view/accounts/legal'
import legalAccount from '@/view/accounts/legalAccount'
import transferLegal from '@/view/accounts/transferLegal'
import transferLog from '@/view/transfer_log'
import allTransaction from '@/view/all_transaction'
import leverTransactions from '@/view/lever_transactions'
import leverTransaction from '@/view/lever/lever_transaction'
import leverList from '@/view/lever/leverList'
import transferRecord from '@/view/lever/transferRecord'
import success from '@/view/success'

import ForgetPwd from '@/components/ForgetPwd'  //忘记密码
import ResetPwd from '@/components/ResetPwd'  //重置密码密码
import withdraw_address from '@/view/accounts/withdraw_address'
import leverRecord from '../view/lever/leverRecord.vue'
import bindEmail from '../view/bindEmail.vue'
Vue.use(Router)
export default new Router({
	routes: [

		{
			path: '/',
			name: 'home',
			component: home,
			
			children:[
				{
					path:'',
					name:'homeContent',
					component:homeContent
					
				},
				{
					path:'/legalTrade',
					component:() => import ('../components/LegalTrade.vue')
				},
				{
					path:'/legalPay',
					component:() => import ('../components/LegalPay.vue')
				},
				{
					path:'/legalPayDetail',
					component:() => import ('../components/LegalPayDetail.vue')
				},
				{
					path:'/shopLegalPayDetail',
					component:() => import ('../components/shop_legal_pay_detail.vue')
				},
				{
					path:'/legalRecord',
					component:() => import ('../components/LegalRecord.vue')
				},
				{
					path:'/legalTradeSet',
					component:() => import ('../components/LegalTradeSet.vue')
				},
				{
					path:'/legalSeller',
					component:() => import ('../components/LegalSeller.vue')
				},
				{
					path:'/myLegalShops',
					component:() => import ('../components/MyLegalShops.vue')
				},
				{
					path:'/legalShopDetail',
					component:() => import ('../components/LegalShopDetail.vue')
				},
				{
					path:'/shopLegalRecord',
					component:() => import ('../components/shop_legal_record.vue')
				},
				{
					path: '/fiatradCenter',
					name: 'fiatradCenter',
					component: fiatradCenter
				},
				{
					path:'/userSetting',
					name:'userSetting',
					component:userSetting,
					children:[
						{
							path:'',
							component:payOpts
						}
					]
				},
				{
					path:'/c2c',
					name:'c2c',
					component:c2c,
					children:[
						
					]
				},
				{
					path:'/c2cOrder',
					name:'c2cOrder',
					component:c2cOrder
				
				},
				{
					path:'/c2cRelease',
					name:'c2cRelease',
					component:c2cRelease
				
				},
				{
					path:'/c2cTrade',
					name:'c2cTrade',
					component:c2cTrade
				
				},
				{
					path:'/c2cDetail',
					name:'c2cDetail',
					component:c2cDetail
				
				},
				{
					path:'/dealCenter',
					name:'dealCenter',
					component:dealCenter
				},
				{
					path:'/leverdealCenter',
					name:'leverdealCenter',
					component:leverdealCenter
				},
				{
					path:'/allTransaction',
					name:'allTransaction',
					component:allTransaction
				},
				{
					path:'/leverRecord',
					component:leverRecord
				},
				{
					path:'/bindEmail',
					component:bindEmail
				},
				{
					path:'/leverTransactions',
					name:'leverTransactions',
					component:leverTransactions
				},
				{
					path:'/leverTransaction',
					name:'leverTransaction',
					component:leverTransaction
				},
				{
					path:'/leverList',
					name:'leverList',
					component:leverList
				},
				{
					path:'/transferRecord',
					name:'transferRecord',
					component:transferRecord
				},
				{
					path:'/success',
					name:'success',
					component:success
				}
				
			]
		},
		// {
		// 	path:'/dealCenter',
		// 	name:'dealCenter',
		// 	component:dealCenter
		// },
		{
			path:'/components/login',
			name: 'login',
			component: login
		},
		{
			path:'/forgetPwd',
			name: 'forgetPwd',
			component: ForgetPwd
		},
		{
			path:'/resetPwd',
			name: 'resetPwd',
			component: ResetPwd
		},
		{
			path:'/components/register',
			name: 'register',
			component: register
		},
		{
			path:'/noticeList',
			name:'noticeList',
			component:noticeList
		},
		{
			path:'/components/noticeDetail',
			name:'noticeDetail',
			component:noticeDetail
		},
		{
			path:'/account',
			name:'account',
			component:account,
			children: [
				{
				  path: '/accountCenter',
				  name: 'accountCenter',
				  component: accountCenter
				},
				{
					path: '/accountEntrust',
				  	name: 'accountEntrust',
				  	component: accountEntrust
				},
				{
					path: '/accountMessage',
				  	name: 'accountMessage',
				  	component: accountMessage
				},
				{
					path: '/accountSet',
				  	name: 'accountSet',
				  	component: accountSet
				},
				{
					path:'/recharge',
					name:'recharge',
					component:recharge
				},
				{
					path:'/coinRecord',
					name:'coinRecord',
					component:coinRecord
				},
				{
					path:'/rechargeMoney',
					name:'rechargeMoney',
					component:rechargeMoney
				},
				{
					path:'/aceite',
					name:'aceite',
					component:aceite
				},
				{
					path:'/region',
					name:'region',
					component:region
				},
				{
					path:'/chargeRecord',
					name:'chargeRecord',
					component:chargeRecord
				},
				{
					path:'/transferLog',
					name:'transferLog',
					component:transferLog
				},
				{
					path:'/authentication',
					name:'authentication',
					component:authentication
				},
				{
					path:'/payment',
					name:'payment',
					component:payment
				},

			]

		},
		{
			path:'/new_account',
			name:'new_account',
			component:new_account,
			children: [
			
				{
					path:'/finance',
					name:'finance',
					component:finance
				},
				{
					path:'/transfer',
					name:'transfer',
					component:transfer
				},
				{
					path:'/lever',
					name:'lever',
					component:lever
				},
				{
					path:'/legal',
					name:'legal',
					component:legal
				},
				{
					path:'/legalAccount',
					name:'legalAccount',
					component:legalAccount
				},
				{
					path:'/transferLegal',
					component:transferLegal
				}
				

			]

		},
	    // 合约管理
		{
			
			path:'/lever_manger',
			name:'manger',
			component:manger,
		},
		// 财务记录
		{
			
			path:'/finanrec',
			name:'finanrec',
			component:finanrec,
		},
		// 地址管理
		{
			
			path:'/withdraw_address',
			name:'withdraw_address',
			component:withdraw_address,
		},
		{
			path:'/setCash',
			name: 'setCash',
			component: setCash
		},
		


	]
})

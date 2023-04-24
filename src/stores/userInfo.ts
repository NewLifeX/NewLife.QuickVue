import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import { Session } from '/@/utils/storage';
import { useUserApi } from '../api/user';
const userApi = useUserApi();

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
	state: (): UserInfosState => ({
		userInfos: {
			userName: '',
			photo: '',
			time: 0,
			roles: [],
			authBtnList: [],
		},
	}),
	actions: {
		async setUserInfos() {
			// 存储用户信息到浏览器缓存
			if (Session.get('userInfo')) {
				this.userInfos = Session.get('userInfo');
			} else {
				const userInfos: any = await this.getApiUserInfo();
				this.userInfos = userInfos;
			}
		},
		// 模拟接口数据
		// https://gitee.com/lyt-top/vue-next-admin/issues/I5F1HP
		async getApiUserInfo() {
			return new Promise((resolve) => {
				userApi.info().then(res => {		
					let defaultBtnRoles: Array<string> = ['2#8', '2#255', ...res.data.permission.split(',')];
					// let defaultAuthBtnList: Array<string> = [];
					const userInfos = {
						userName: res.data.name,
						photo: res.data.avatar,
						time: new Date().getTime(),
						// roles: [],
						authBtnList: defaultBtnRoles,
					};
					resolve(userInfos);
				})
			});
		},
	},
});

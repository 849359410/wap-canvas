import Socket from "@server/socket";
import { mapState, mapGetters } from "vuex";
export default {
	data() {
		return {
			ws: null,
			ioList: {
				attach: "",
				content: {
					bet_list: {},
					period: "",
					url: "",
					win_rate: "",
					hit_time: ""
				},
				sender_id: "", // 用户名
				receiver_id: "", // 聊天室id
				message_type: 6, // 推送类型 0是聊天 4 是注单 5是计划员 6是高手计划
				release_time: 0, // 当前时间戳
				single_chat: "", // 跟谁聊天就传谁的用户名
				sender_vo: {
					nick_name: "",
					role_type: 0,
					sender_name: "",
					sender_portrait: "",
					vip_level: ""
				}
			}
		};
	},
	computed: {
		...mapState({
			userMessage: state => state.user.userMessage,
			periods: state => state.lottery.period,
			isLogin: state => state.user.isLogin,
			webCommonWap: state => state.common.webCommonWap
		}),
		...mapGetters(["operableLotteries"])
	},
	beforeDestroy() {
		if (this.ws !== null && this.ws.id !== null) {
			this.closeWs();
		}
	},
	destroyed() {
		if (this.ws !== null && this.ws.id !== null) {
			this.closeWs();
		}
	},
	methods: {
		// 启动链接
		startLinkChat(n) {
			this.ioList.receiver_id = n.id.toString();
			if (this.ws !== null && this.ws.id !== null) {
				this.closeWs();
			}
			// http://eg_wap_y.eg7000.org:8088
			//192.168.1.3:9527
			//192.168.1.6:9527/
			this.ws = new Socket("/chat", {
				query: {
					sid: n.chat_key,
					group_id: n.id,
					account: this.userMessage.username
				},
				heartbeat: true,
				messageType: "binary"
			});
			this.ws.conn();
		},
		sendChatSocket(item, lottery) {
			const list = this.$helps.cloneDeep(this.ioList);
			list.sender_id = this.userMessage.username;
			list.sender_vo.sender_name = this.userMessage.name;
			list.sender_vo.vip_level = this.$stores.get("get_vip");
			list.sender_vo.sender_portrait = this.userMessage.pic_id.toString();
			list.content.period = this.periods.period;
			item.forEach(i => {
				i.play_name = lottery.play_name;
			});
			list.content.bet_list = item;
			list.content.url = JSON.stringify(lottery);
			list.content.win_rate = lottery.rate;
			list.content.hit_time = Number(lottery.combo);
			if (typeof list.content !== "string") {
				list.content = JSON.stringify(list.content);
			}
			if (this.ws !== null) this.ws.send(list);
		},
		closeWs() {
			if (this.ws !== null) this.ws.close();
			this.ws = null;
		}
	}
};

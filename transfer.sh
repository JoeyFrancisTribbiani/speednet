#!/usr/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

#=================================================
#	System Required: CentOS/Debian/Ubuntu
#	Description: transfer
#	Version: 1.0.6
#	Author: Toyo
#	Blog: https://doub.io/wlzy-jc37/
#=================================================

sh_ver="1.0.6"
filepath=$(
    cd "$(dirname "$0")"
    pwd
)
file_1=$(echo -e "${filepath}" | awk -F "$0" '{print $1}')
file="/usr/local/transfer-pf"
transfer_file="/usr/local/transfer-pf/transfer"
transfer_conf="/usr/local/transfer-pf/transfer.conf"
transfer_log="/usr/local/transfer-pf/transfer.log"
Crontab_file="/usr/bin/crontab"

Green_font_prefix="\033[32m" && Red_font_prefix="\033[31m" && Green_background_prefix="\033[42;37m" && Red_background_prefix="\033[41;37m" && Font_color_suffix="\033[0m"
Info="${Green_font_prefix}[信息]${Font_color_suffix}"
Error="${Red_font_prefix}[错误]${Font_color_suffix}"
Tip="${Green_font_prefix}[注意]${Font_color_suffix}"

check_root() {
    [[ $EUID != 0 ]] && echo -e "${Error} 当前非ROOT账号(或没有ROOT权限)，无法继续操作，请更换ROOT账号或使用 ${Green_background_prefix}sudo su${Font_color_suffix} 命令获取临时ROOT权限（执行后可能会提示输入当前账号的密码）。" && exit 1
}
#检查系统
check_sys() {
    if [[ -f /etc/redhat-release ]]; then
        release="centos"
    elif cat /etc/issue | grep -q -E -i "debian"; then
        release="debian"
    elif cat /etc/issue | grep -q -E -i "ubuntu"; then
        release="ubuntu"
    elif cat /etc/issue | grep -q -E -i "centos|red hat|redhat"; then
        release="centos"
    elif cat /proc/version | grep -q -E -i "debian"; then
        release="debian"
    elif cat /proc/version | grep -q -E -i "ubuntu"; then
        release="ubuntu"
    elif cat /proc/version | grep -q -E -i "centos|red hat|redhat"; then
        release="centos"
    fi
    bit=$(uname -m)
}
check_installed_status() {
    [[ ! -e ${transfer_file} ]] && echo -e "${Error} transfer 没有安装，请检查 !" && exit 1
}
check_crontab_installed_status() {
    if [[ ! -e ${Crontab_file} ]]; then
        echo -e "${Error} Crontab 没有安装，开始安装..."
        if [[ ${release} == "centos" ]]; then
            yum install crond -y
        else
            apt-get install cron -y
        fi
        if [[ ! -e ${Crontab_file} ]]; then
            echo -e "${Error} Crontab 安装失败，请检查！" && exit 1
        else
            echo -e "${Info} Crontab 安装成功！"
        fi
    fi
}
check_pid() {
    PID=$(ps -ef | grep "transfer relays" | grep -v grep | grep -v ".sh" | grep -v "init.d" | grep -v "service" | awk '{print $2}')
}
check_new_ver() {
    echo -e "请输入要下载安装的 transfer 版本号 ${Green_font_prefix}[ 格式是日期，例如: v20180909 ]${Font_color_suffix}
版本列表请去这里获取：${Green_font_prefix}[ https://github.com/txthinking/transfer/releases ]${Font_color_suffix}"
    read -e -p "直接回车即自动获取:" transfer_new_ver
    if [[ -z ${transfer_new_ver} ]]; then
        transfer_new_ver=$(wget -qO- https://api.github.com/repos/txthinking/transfer/releases | grep "tag_name" | head -n 1 | awk -F ":" '{print $2}' | sed 's/\"//g;s/,//g;s/ //g')
        [[ -z ${transfer_new_ver} ]] && echo -e "${Error} transfer 最新版本获取失败！" && exit 1
        echo -e "${Info} 检测到 transfer 最新版本为 [ ${transfer_new_ver} ]"
    else
        echo -e "${Info} 开始下载 transfer [ ${transfer_new_ver} ] 版本！"
    fi
}
check_ver_comparison() {
    transfer_now_ver=$(${transfer_file} -v | awk '{print $3}')
    [[ -z ${transfer_now_ver} ]] && echo -e "${Error} transfer 当前版本获取失败 !" && exit 1
    transfer_now_ver="v${transfer_now_ver}"
    if [[ "${transfer_now_ver}" != "${transfer_new_ver}" ]]; then
        echo -e "${Info} 发现 transfer 已有新版本 [ ${transfer_new_ver} ]，旧版本 [ ${transfer_now_ver} ]"
        read -e -p "是否更新 ? [Y/n] :" yn
        [[ -z "${yn}" ]] && yn="y"
        if [[ $yn == [Yy] ]]; then
            check_pid
            [[ ! -z $PID ]] && kill -9 ${PID}
            rm -rf ${transfer_file}
            Download_transfer
            Start_transfer
        fi
    else
        echo -e "${Info} 当前 transfer 已是最新版本 [ ${transfer_new_ver} ]" && exit 1
    fi
}
Download_transfer() {
    [[ ! -e ${file} ]] && mkdir ${file}
    cd ${file}
    if [[ ${bit} == "x86_64" ]]; then
        wget -q "https://github.com/txthinking/brook/releases/download/${transfer_new_ver}/brook_linux_amd64"
        mv brook_linux_amd64 transfer
    else
        wget -q "https://github.com/txthinking/brook/releases/download/${transfer_new_ver}/brook_linux_386"
        mv brook_linux_386 transfer
    fi
    [[ ! -e "transfer" ]] && echo -e "${Error} transfer 下载失败 !" && exit 1
    chmod +x transfer
}
Service_transfer() {
    if [[ ${release} = "centos" ]]; then
        if ! wget --no-check-certificate https://raw.githubusercontent.com/JoeyFrancisTribbiani/speednet/master/brook-pf.sh -O /etc/init.d/transfer-pf; then
            echo -e "${Error} transfer服务 管理脚本下载失败 !" && exit 1
        fi
        chmod +x /etc/init.d/transfer-pf
        chkconfig --add transfer-pf
        chkconfig transfer-pf on
    else
        if ! wget --no-check-certificate https://raw.githubusercontent.com/JoeyFrancisTribbiani/speednet/master/brook-pf.sh -O /etc/init.d/transfer-pf; then
            echo -e "${Error} transfer服务 管理脚本下载失败 !" && exit 1
        fi
        chmod +x /etc/init.d/transfer-pf
        update-rc.d -f transfer-pf defaults
    fi
    echo -e "${Info} transfer服务 管理脚本下载完成 !"
}
Installation_dependency() {
    \cp -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
}
Read_config() {
    [[ ! -e ${transfer_conf} ]] && echo -e "${Error} transfer 配置文件不存在 !" && exit 1
    user_all=$(cat ${transfer_conf})
    user_all_num=$(echo "${user_all}" | wc -l)
    [[ -z ${user_all} ]] && echo -e "${Error} transfer 配置文件中用户配置为空 !" && exit 1
}
Set_pf_Enabled() {
    echo -e "立即启用该内容分发，还是禁用？ [Y/n]"
    read -e -p "(默认: Y 启用):" pf_Enabled_un
    [[ -z ${pf_Enabled_un} ]] && pf_Enabled_un="y"
    if [[ ${pf_Enabled_un} == [Yy] ]]; then
        bk_Enabled="1"
    else
        bk_Enabled="0"
    fi
}
Set_port_Modify() {
    while true; do
        echo -e "请选择并输入要修改的 transfer 内容分发本地监听端口 [1-65535]"
        read -e -p "(默认取消):" bk_port_Modify
        [[ -z "${bk_port_Modify}" ]] && echo "取消..." && exit 1
        echo $((${bk_port_Modify} + 0)) &>/dev/null
        if [[ $? -eq 0 ]]; then
            if [[ ${bk_port_Modify} -ge 1 ]] && [[ ${bk_port_Modify} -le 65535 ]]; then
                check_port "${bk_port_Modify}"
                if [[ $? == 0 ]]; then
                    break
                else
                    echo -e "${Error} 该本地监听端口不存在 [${bk_port_Modify}] !"
                fi
            else
                echo "输入错误, 请输入正确的端口。"
            fi
        else
            echo "输入错误, 请输入正确的端口。"
        fi
    done
}
Set_port() {
    while true; do
        echo -e "请输入 transfer 本地监听端口 [1-65535]（端口不能重复，避免冲突）"
        read -e -p "(默认取消):" bk_port
        [[ -z "${bk_port}" ]] && echo "已取消..." && exit 1
        echo $((${bk_port} + 0)) &>/dev/null
        if [[ $? -eq 0 ]]; then
            if [[ ${bk_port} -ge 1 ]] && [[ ${bk_port} -le 65535 ]]; then
                echo && echo "========================"
                echo -e "	本地监听端口 : ${Red_background_prefix} ${bk_port} ${Font_color_suffix}"
                echo "========================" && echo
                break
            else
                echo "输入错误, 请输入正确的端口。"
            fi
        else
            echo "输入错误, 请输入正确的端口。"
        fi
    done
}
Set_IP_pf() {
    echo "请输入被转发的 IP :"
    read -e -p "(默认取消):" bk_ip_pf
    [[ -z "${bk_ip_pf}" ]] && echo "已取消..." && exit 1
    echo && echo "========================"
    echo -e "	被转发IP : ${Red_background_prefix} ${bk_ip_pf} ${Font_color_suffix}"
    echo "========================" && echo
}
Set_port_pf() {
    while true; do
        echo -e "请输入 transfer 被转发的端口 [1-65535]"
        read -e -p "(默认取消):" bk_port_pf
        [[ -z "${bk_port_pf}" ]] && echo "已取消..." && exit 1
        echo $((${bk_port_pf} + 0)) &>/dev/null
        if [[ $? -eq 0 ]]; then
            if [[ ${bk_port_pf} -ge 1 ]] && [[ ${bk_port_pf} -le 65535 ]]; then
                echo && echo "========================"
                echo -e "	被转发端口 : ${Red_background_prefix} ${bk_port_pf} ${Font_color_suffix}"
                echo "========================" && echo
                break
            else
                echo "输入错误, 请输入正确的端口。"
            fi
        else
            echo "输入错误, 请输入正确的端口。"
        fi
    done
}
Set_transfer() {
    check_installed_status
    echo && echo -e "你要做什么？
 ${Green_font_prefix}1.${Font_color_suffix}  添加 内容分发
 ${Green_font_prefix}2.${Font_color_suffix}  删除 内容分发
 ${Green_font_prefix}3.${Font_color_suffix}  修改 内容分发
 ${Green_font_prefix}4.${Font_color_suffix}  启用/禁用 内容分发
 
 ${Tip} 本地监听端口不能重复，被转发的IP或端口可重复!" && echo
    read -e -p "(默认: 取消):" bk_modify
    [[ -z "${bk_modify}" ]] && echo "已取消..." && exit 1
    if [[ ${bk_modify} == "1" ]]; then
        Add_pf
    elif [[ ${bk_modify} == "2" ]]; then
        Del_pf
    elif [[ ${bk_modify} == "3" ]]; then
        Modify_pf
    elif [[ ${bk_modify} == "4" ]]; then
        Modify_Enabled_pf
    else
        echo -e "${Error} 请输入正确的数字(1-4)" && exit 1
    fi
}
check_port() {
    check_port_1=$1
    user_all=$(cat ${transfer_conf} | sed '1d;/^\s*$/d')
    #[[ -z "${user_all}" ]] && echo -e "${Error} transfer 配置文件中用户配置为空 !" && exit 1
    check_port_statu=$(echo "${user_all}" | awk '{print $1}' | grep -w "${check_port_1}")
    if [[ ! -z "${check_port_statu}" ]]; then
        return 0
    else
        return 1
    fi
}
list_port() {
    port_Type=$1
    user_all=$(cat ${transfer_conf} | sed '/^\s*$/d')
    if [[ -z "${user_all}" ]]; then
        if [[ "${port_Type}" == "ADD" ]]; then
            echo -e "${Info} 目前 transfer 配置文件中用户配置为空。"
        else
            echo -e "${Info} 目前 transfer 配置文件中用户配置为空。" && exit 1
        fi
    else
        user_num=$(echo -e "${user_all}" | wc -l)
        for ((integer = 1; integer <= ${user_num}; integer++)); do
            user_port=$(echo "${user_all}" | sed -n "${integer}p" | awk '{print $1}')
            user_ip_pf=$(echo "${user_all}" | sed -n "${integer}p" | awk '{print $2}')
            user_port_pf=$(echo "${user_all}" | sed -n "${integer}p" | awk '{print $3}')
            user_Enabled_pf=$(echo "${user_all}" | sed -n "${integer}p" | awk '{print $4}')
            if [[ ${user_Enabled_pf} == "0" ]]; then
                user_Enabled_pf_1="${Red_font_prefix}禁用${Font_color_suffix}"
            else
                user_Enabled_pf_1="${Green_font_prefix}启用${Font_color_suffix}"
            fi
            user_list_all=${user_list_all}"本地监听端口: ${Green_font_prefix}"${user_port}"${Font_color_suffix}\t 被转发IP: ${Green_font_prefix}"${user_ip_pf}"${Font_color_suffix}\t 被转发端口: ${Green_font_prefix}"${user_port_pf}"${Font_color_suffix}\t 状态: ${user_Enabled_pf_1}\n"
            user_IP=""
        done
        ip=$(wget -qO- -t1 -T2 ipinfo.io/ip)
        if [[ -z "${ip}" ]]; then
            ip=$(wget -qO- -t1 -T2 api.ip.sb/ip)
            if [[ -z "${ip}" ]]; then
                ip=$(wget -qO- -t1 -T2 members.3322.org/dyndns/getip)
                if [[ -z "${ip}" ]]; then
                    ip="VPS_IP"
                fi
            fi
        fi
        echo -e "当前内容分发总数: ${Green_background_prefix} "${user_num}" ${Font_color_suffix} 当前服务器IP: ${Green_background_prefix} "${ip}" ${Font_color_suffix}"
        echo -e "${user_list_all}"
        echo -e "========================\n"
    fi
}
Add_pf() {
    while true; do
        list_port "ADD"
        Set_port
        check_port "${bk_port}"
        [[ $? == 0 ]] && echo -e "${Error} 该本地监听端口已使用 [${bk_port}] !" && exit 1
        Set_IP_pf
        Set_port_pf
        Set_pf_Enabled
        echo "${bk_port} ${bk_ip_pf} ${bk_port_pf} ${bk_Enabled}" >>${transfer_conf}
        Add_success=$(cat ${transfer_conf} | grep ${bk_port})
        if [[ -z "${Add_success}" ]]; then
            echo -e "${Error} 内容分发 添加失败 ${Green_font_prefix}[端口: ${bk_port} 被转发IP和端口: ${bk_ip_pf}:${bk_port_pf}]${Font_color_suffix} "
            break
        else
            Add_iptables
            Save_iptables
            echo -e "${Info} 内容分发 添加成功 ${Green_font_prefix}[端口: ${bk_port} 被转发IP和端口: ${bk_ip_pf}:${bk_port_pf}]${Font_color_suffix}\n"
            read -e -p "是否继续 添加内容分发配置？[Y/n]:" addyn
            [[ -z ${addyn} ]] && addyn="y"
            if [[ ${addyn} == [Nn] ]]; then
                Restart_transfer
                break
            else
                echo -e "${Info} 继续 添加内容分发配置..."
                user_list_all=""
            fi
        fi
    done
}
Del_pf() {
    while true; do
        list_port
        Set_port
        check_port "${bk_port}"
        [[ $? == 1 ]] && echo -e "${Error} 该本地监听端口不存在 [${bk_port}] !" && exit 1
        sed -i "/^${bk_port} /d" ${transfer_conf}
        Del_success=$(cat ${transfer_conf} | grep ${bk_port})
        if [[ ! -z "${Del_success}" ]]; then
            echo -e "${Error} 内容分发 删除失败 ${Green_font_prefix}[端口: ${bk_port}]${Font_color_suffix} "
            break
        else
            port=${bk_port}
            Del_iptables
            Save_iptables
            echo -e "${Info} 内容分发 删除成功 ${Green_font_prefix}[端口: ${bk_port}]${Font_color_suffix}\n"
            port_num=$(cat ${transfer_conf} | sed '/^\s*$/d' | wc -l)
            if [[ ${port_num} == 0 ]]; then
                echo -e "${Error} 已无任何端口 !"
                check_pid
                if [[ ! -z ${PID} ]]; then
                    Stop_transfer
                fi
                break
            else
                read -e -p "是否继续 删除内容分发配置？[Y/n]:" delyn
                [[ -z ${delyn} ]] && delyn="y"
                if [[ ${delyn} == [Nn] ]]; then
                    Restart_transfer
                    break
                else
                    echo -e "${Info} 继续 删除内容分发配置..."
                    user_list_all=""
                fi
            fi
        fi
    done
}
Modify_pf() {
    list_port
    Set_port_Modify
    echo -e "\n${Info} 开始输入新端口... \n"
    Set_port
    check_port "${bk_port}"
    [[ $? == 0 ]] && echo -e "${Error} 该端口已存在 [${bk_port}] !" && exit 1
    Set_IP_pf
    Set_port_pf
    sed -i "/^${bk_port_Modify} /d" ${transfer_conf}
    Set_pf_Enabled
    echo "${bk_port} ${bk_ip_pf} ${bk_port_pf} ${bk_Enabled}" >>${transfer_conf}
    Modify_success=$(cat ${transfer_conf} | grep "${bk_port} ${bk_ip_pf} ${bk_port_pf} ${bk_Enabled}")
    if [[ -z "${Modify_success}" ]]; then
        echo -e "${Error} 内容分发 修改失败 ${Green_font_prefix}[端口: ${bk_port} 被转发IP和端口: ${bk_ip_pf}:${bk_port_pf}]${Font_color_suffix}"
        exit 1
    else
        port=${bk_port_Modify}
        Del_iptables
        Add_iptables
        Save_iptables
        Restart_transfer
        echo -e "${Info} 内容分发 修改成功 ${Green_font_prefix}[端口: ${bk_port} 被转发IP和端口: ${bk_ip_pf}:${bk_port_pf}]${Font_color_suffix}\n"
    fi
}
Modify_Enabled_pf() {
    list_port
    Set_port_Modify
    user_pf_text=$(cat ${transfer_conf} | sed '/^\s*$/d' | grep "${bk_port_Modify}")
    user_port_text=$(echo ${user_pf_text} | awk '{print $1}')
    user_ip_pf_text=$(echo ${user_pf_text} | awk '{print $2}')
    user_port_pf_text=$(echo ${user_pf_text} | awk '{print $3}')
    user_Enabled_pf_text=$(echo ${user_pf_text} | awk '{print $4}')
    if [[ ${user_Enabled_pf_text} == "0" ]]; then
        echo -e "该内容分发已${Red_font_prefix}禁用${Font_color_suffix}，是否${Green_font_prefix}启用${Font_color_suffix}？ [Y/n]"
        read -e -p "(默认: Y 启用):" user_Enabled_pf_text_un
        [[ -z ${user_Enabled_pf_text_un} ]] && user_Enabled_pf_text_un="y"
        if [[ ${user_Enabled_pf_text_un} == [Yy] ]]; then
            user_Enabled_pf_text_1="1"
            sed -i "/^${bk_port_Modify} /d" ${transfer_conf}
            echo "${user_port_text} ${user_ip_pf_text} ${user_port_pf_text} ${user_Enabled_pf_text_1}" >>${transfer_conf}
            Modify_Enabled_success=$(cat ${transfer_conf} | grep "${user_port_text} ${user_ip_pf_text} ${user_port_pf_text} ${user_Enabled_pf_text_1}")
            if [[ -z "${Modify_Enabled_success}" ]]; then
                echo -e "${Error} 内容分发 启用失败 ${Green_font_prefix}[端口: ${user_port_text} 被转发IP和端口: ${user_ip_pf_text}:${user_port_pf_text}]${Font_color_suffix}"
                exit 1
            else
                echo -e "${Info} 内容分发 启用成功 ${Green_font_prefix}[端口: ${user_port_text} 被转发IP和端口: ${user_ip_pf_text}:${user_port_pf_text}]${Font_color_suffix}\n"
                Restart_transfer
            fi
        else
            echo "已取消..." && exit 0
        fi
    else
        echo -e "该内容分发已${Green_font_prefix}启用${Font_color_suffix}，是否${Red_font_prefix}禁用${Font_color_suffix}？ [Y/n]"
        read -e -p "(默认: Y 禁用):" user_Enabled_pf_text_un
        [[ -z ${user_Enabled_pf_text_un} ]] && user_Enabled_pf_text_un="y"
        if [[ ${user_Enabled_pf_text_un} == [Yy] ]]; then
            user_Enabled_pf_text_1="0"
            sed -i "/^${bk_port_Modify} /d" ${transfer_conf}
            echo "${user_port_text} ${user_ip_pf_text} ${user_port_pf_text} ${user_Enabled_pf_text_1}" >>${transfer_conf}
            Modify_Enabled_success=$(cat ${transfer_conf} | grep "${user_port_text} ${user_ip_pf_text} ${user_port_pf_text} ${user_Enabled_pf_text_1}")
            if [[ -z "${Modify_Enabled_success}" ]]; then
                echo -e "${Error} 内容分发 禁用失败 ${Green_font_prefix}[端口: ${user_port_text} 被转发IP和端口: ${user_ip_pf_text}:${user_port_pf_text}]${Font_color_suffix}"
                exit 1
            else
                echo -e "${Info} 内容分发 禁用成功 ${Green_font_prefix}[端口: ${user_port_text} 被转发IP和端口: ${user_ip_pf_text}:${user_port_pf_text}]${Font_color_suffix}\n"
                Restart_transfer
            fi
        else
            echo "已取消..." && exit 0
        fi
    fi
}
Install_transfer() {
    check_root
    [[ -e ${transfer_file} ]] && echo -e "${Error} 检测到 transfer 已安装 !" && exit 1
    echo -e "${Info} 开始安装/配置 依赖..."
    Installation_dependency
    echo -e "${Info} 开始检测最新版本..."
    # check_new_ver
    transfer_new_ver="v20220501"
    echo -e "${Info} 开始下载/安装..."
    Download_transfer
    echo -e "${Info} 开始下载/安装 服务脚本(init)..."
    Service_transfer
    echo -e "${Info} 开始写入 配置文件..."
    echo "" >${transfer_conf}
    echo -e "${Info} 开始设置 iptables防火墙..."
    Set_iptables
    echo -e "${Info} transfer 安装完成！默认配置文件为空，请选择 [7.设置 transfer 内容分发 - 1.添加 内容分发] 来添加内容分发。"
}
Start_transfer() {
    check_installed_status
    check_pid
    [[ ! -z ${PID} ]] && echo -e "${Error} transfer 正在运行，请检查 !" && exit 1
    /etc/init.d/transfer-pf start
}
Stop_transfer() {
    check_installed_status
    check_pid
    [[ -z ${PID} ]] && echo -e "${Error} transfer 没有运行，请检查 !" && exit 1
    /etc/init.d/transfer-pf stop
}
Restart_transfer() {
    check_installed_status
    check_pid
    [[ ! -z ${PID} ]] && /etc/init.d/transfer-pf stop
    /etc/init.d/transfer-pf start
}
Update_transfer() {
    # check_installed_status
    echo "无更新"
}
Uninstall_transfer() {
    check_installed_status
    echo -e "确定要卸载 transfer ? [y/N]\n"
    read -e -p "(默认: n):" unyn
    [[ -z ${unyn} ]] && unyn="n"
    if [[ ${unyn} == [Yy] ]]; then
        check_pid
        [[ ! -z $PID ]] && kill -9 ${PID}
        if [[ -e ${transfer_conf} ]]; then
            user_all=$(cat ${transfer_conf} | sed '/^\s*$/d')
            user_all_num=$(echo "${user_all}" | wc -l)
            if [[ ! -z ${user_all} ]]; then
                for ((integer = 1; integer <= ${user_all_num}; integer++)); do
                    port=$(echo "${user_all}" | sed -n "${integer}p" | awk '{print $1}')
                    Del_iptables
                done
                Save_iptables
            fi
        fi
        if [[ ! -z $(crontab -l | grep "transfer-pf.sh monitor") ]]; then
            crontab_monitor_transfer_cron_stop
        fi
        rm -rf ${file}
        if [[ ${release} = "centos" ]]; then
            chkconfig --del transfer-pf
        else
            update-rc.d -f transfer-pf remove
        fi
        rm -rf /etc/init.d/transfer-pf
        echo && echo "transfer 卸载完成 !" && echo
    else
        echo && echo "卸载已取消..." && echo
    fi
}
View_Log() {
    check_installed_status
    [[ ! -e ${transfer_log} ]] && echo -e "${Error} transfer 日志文件不存在 !" && exit 1
    echo && echo -e "${Tip} 按 ${Red_font_prefix}Ctrl+C${Font_color_suffix} 终止查看日志(正常情况是没有使用日志记录的)" && echo -e "如果需要查看完整日志内容，请用 ${Red_font_prefix}cat ${transfer_log}${Font_color_suffix} 命令。" && echo
    tail -f ${transfer_log}
}
Set_crontab_monitor_transfer() {
    check_installed_status
    check_crontab_installed_status
    crontab_monitor_transfer_status=$(crontab -l | grep "transfer-pf.sh monitor")
    if [[ -z "${crontab_monitor_transfer_status}" ]]; then
        echo && echo -e "当前监控模式: ${Green_font_prefix}未开启${Font_color_suffix}" && echo
        echo -e "确定要开启 ${Green_font_prefix}transfer 服务端运行状态监控${Font_color_suffix} 功能吗？(当进程关闭则自动启动 transfer 服务端)[Y/n]"
        read -e -p "(默认: y):" crontab_monitor_transfer_status_ny
        [[ -z "${crontab_monitor_transfer_status_ny}" ]] && crontab_monitor_transfer_status_ny="y"
        if [[ ${crontab_monitor_transfer_status_ny} == [Yy] ]]; then
            crontab_monitor_transfer_cron_start
        else
            echo && echo "	已取消..." && echo
        fi
    else
        echo && echo -e "当前监控模式: ${Green_font_prefix}已开启${Font_color_suffix}" && echo
        echo -e "确定要关闭 ${Green_font_prefix}transfer 服务端运行状态监控${Font_color_suffix} 功能吗？(当进程关闭则自动启动 transfer 服务端)[y/N]"
        read -e -p "(默认: n):" crontab_monitor_transfer_status_ny
        [[ -z "${crontab_monitor_transfer_status_ny}" ]] && crontab_monitor_transfer_status_ny="n"
        if [[ ${crontab_monitor_transfer_status_ny} == [Yy] ]]; then
            crontab_monitor_transfer_cron_stop
        else
            echo && echo "	已取消..." && echo
        fi
    fi
}
crontab_monitor_transfer_cron_start() {
    crontab -l >"$file_1/crontab.bak"
    sed -i "/transfer-pf.sh monitor/d" "$file_1/crontab.bak"
    echo -e "\n* * * * * /bin/bash $file_1/transfer-pf.sh monitor" >>"$file_1/crontab.bak"
    crontab "$file_1/crontab.bak"
    rm -r "$file_1/crontab.bak"
    cron_config=$(crontab -l | grep "transfer-pf.sh monitor")
    if [[ -z ${cron_config} ]]; then
        echo -e "${Error} transfer 服务端运行状态监控功能 启动失败 !" && exit 1
    else
        echo -e "${Info} transfer 服务端运行状态监控功能 启动成功 !"
    fi
}
crontab_monitor_transfer_cron_stop() {
    crontab -l >"$file_1/crontab.bak"
    sed -i "/transfer-pf.sh monitor/d" "$file_1/crontab.bak"
    crontab "$file_1/crontab.bak"
    rm -r "$file_1/crontab.bak"
    cron_config=$(crontab -l | grep "transfer-pf.sh monitor")
    if [[ ! -z ${cron_config} ]]; then
        echo -e "${Error} transfer 服务端运行状态监控功能 停止失败 !" && exit 1
    else
        echo -e "${Info} transfer 服务端运行状态监控功能 停止成功 !"
    fi
}
crontab_monitor_transfer() {
    check_installed_status
    check_pid
    echo "${PID}"
    if [[ -z ${PID} ]]; then
        echo -e "${Error} [$(date "+%Y-%m-%d %H:%M:%S %u %Z")] 检测到 transfer服务端 未运行 , 开始启动..." | tee -a ${transfer_log}
        /etc/init.d/transfer-pf start
        sleep 1s
        check_pid
        if [[ -z ${PID} ]]; then
            echo -e "${Error} [$(date "+%Y-%m-%d %H:%M:%S %u %Z")] transfer服务端 启动失败..." | tee -a ${transfer_log}
        else
            echo -e "${Info} [$(date "+%Y-%m-%d %H:%M:%S %u %Z")] transfer服务端 启动成功..." | tee -a ${transfer_log}
        fi
    else
        echo -e "${Info} [$(date "+%Y-%m-%d %H:%M:%S %u %Z")] transfer服务端 进程运行正常..." | tee -a ${transfer_log}
    fi
}
Add_iptables() {
    iptables -I INPUT -m state --state NEW -m tcp -p tcp --dport ${bk_port} -j ACCEPT
    iptables -I INPUT -m state --state NEW -m udp -p udp --dport ${bk_port} -j ACCEPT
}
Del_iptables() {
    iptables -D INPUT -m state --state NEW -m tcp -p tcp --dport ${port} -j ACCEPT
    iptables -D INPUT -m state --state NEW -m udp -p udp --dport ${port} -j ACCEPT
}
Save_iptables() {
    if [[ ${release} == "centos" ]]; then
        service iptables save
    else
        iptables-save >/etc/iptables.up.rules
    fi
}
Set_iptables() {
    if [[ ${release} == "centos" ]]; then
        service iptables save
        chkconfig --level 2345 iptables on
    else
        iptables-save >/etc/iptables.up.rules
        echo -e '#!/bin/bash\n/sbin/iptables-restore < /etc/iptables.up.rules' >/etc/network/if-pre-up.d/iptables
        chmod +x /etc/network/if-pre-up.d/iptables
    fi
}
Update_Shell() {
    # sh_new_ver=$(wget --no-check-certificate -qO- -t1 -T3 "https://raw.githubusercontent.com/ToyoDAdoubiBackup/doubi/master/transfer-pf.sh" | grep 'sh_ver="' | awk -F "=" '{print $NF}' | sed 's/\"//g' | head -1) && sh_new_type="github"
    # [[ -z ${sh_new_ver} ]] && echo -e "${Error} 无法链接到 Github !" && exit 0
    # if [[ -e "/etc/init.d/transfer-pf" ]]; then
    #     rm -rf /etc/init.d/transfer-pf
    #     Service_transfer
    # fi
    # wget -N --no-check-certificate "https://raw.githubusercontent.com/ToyoDAdoubiBackup/doubi/master/transfer-pf.sh" && chmod +x transfer.sh
    echo -e "脚本已更新为最新版本!(注意：因为更新方式为直接覆盖当前运行的脚本，所以可能下面会提示一些报错，无视即可)" && exit 0
}
check_sys
action=$1
if [[ "${action}" == "monitor" ]]; then
    crontab_monitor_transfer
else

    echo && echo -e "  transfer 内容分发 一键管理脚本 
 
 ${Green_font_prefix} 0.${Font_color_suffix} 升级脚本
————————————
 ${Green_font_prefix} 1.${Font_color_suffix} 安装 transfer
 ${Green_font_prefix} 2.${Font_color_suffix} 更新 transfer
 ${Green_font_prefix} 3.${Font_color_suffix} 卸载 transfer
————————————
 ${Green_font_prefix} 4.${Font_color_suffix} 启动 transfer
 ${Green_font_prefix} 5.${Font_color_suffix} 停止 transfer
 ${Green_font_prefix} 6.${Font_color_suffix} 重启 transfer
————————————
 ${Green_font_prefix} 7.${Font_color_suffix} 设置 transfer 内容分发
 ${Green_font_prefix} 8.${Font_color_suffix} 查看 transfer 内容分发
 ${Green_font_prefix} 9.${Font_color_suffix} 查看 transfer 日志
 ${Green_font_prefix}10.${Font_color_suffix} 监控 transfer 运行状态
————————————" && echo
    if [[ -e ${transfer_file} ]]; then
        check_pid
        if [[ ! -z "${PID}" ]]; then
            echo -e " 当前状态: ${Green_font_prefix}已安装${Font_color_suffix} 并 ${Green_font_prefix}已启动${Font_color_suffix}"
        else
            echo -e " 当前状态: ${Green_font_prefix}已安装${Font_color_suffix} 但 ${Red_font_prefix}未启动${Font_color_suffix}"
        fi
    else
        echo -e " 当前状态: ${Red_font_prefix}未安装${Font_color_suffix}"
    fi
    echo
    read -e -p " 请输入数字 [0-10]:" num
    case "$num" in
    0)
        Update_Shell
        ;;
    1)
        Install_transfer
        ;;
    2)
        Update_transfer
        ;;
    3)
        Uninstall_transfer
        ;;
    4)
        Start_transfer
        ;;
    5)
        Stop_transfer
        ;;
    6)
        Restart_transfer
        ;;
    7)
        Set_transfer
        ;;
    8)
        check_installed_status
        list_port
        ;;
    9)
        View_Log
        ;;
    10)
        Set_crontab_monitor_transfer
        ;;
    *)
        echo "请输入正确数字 [0-10]"
        ;;
    esac
fi

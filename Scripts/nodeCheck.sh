source /home/ec2-user/.bash_profile
if ! which npm; then
	# curl -L https://www.npmjs.com/install.sh | sh
	# export NVM_DIR="/.nvm"
	# [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
	# ln -s /usr/local/bin/npm /usr/bin/npm
	# npm install 4.4.5
	curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
	yum -y install nodejs
	npm install npm@latest -g
	yum -y install git
	npm install forever -g
	npm install forever-monitor -g
fi

# allow HTTP inbound and replies
iptables -A INPUT -p tcp --dport 80 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -p tcp --sport 80 -m state --state ESTABLISHED -j ACCEPT
# save config
/sbin/service iptables save
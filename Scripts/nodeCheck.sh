Defaults:
source /home/ec2-user/.bash_profile
if ! which npm; then
	su -c curl -L https://www.npmjs.com/install.sh | su -c sh
	# export NVM_DIR="/.nvm"
	# [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
	su -c ln -s /usr/local/bin/npm /usr/bin/npm
	su -c npm install 4.4.5
fi


Defaults:ec2-user !requiretty
source /home/ec2-user/.bash_profile
if ! which npm; then
	sudo curl -L https://www.npmjs.com/install.sh | sudo sh
	# export NVM_DIR="/.nvm"
	# [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
	sudo ln -s /usr/local/bin/npm /usr/bin/npm
	sudo npm install 4.4.5
fi


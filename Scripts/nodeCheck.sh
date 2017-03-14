source /home/ec2-user/.bash_profile
if ! which npm; then
	# curl -L https://www.npmjs.com/install.sh | sh
	# export NVM_DIR="/.nvm"
	# [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
	# ln -s /usr/local/bin/npm /usr/bin/npm
	# npm install 4.4.5
	sudo apt-get -y install nodejs npm
fi


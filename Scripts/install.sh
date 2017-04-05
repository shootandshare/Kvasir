source /home/ec2-user/.bash_profile
cd /wepayAdminApp
npm install
aws s3 cp s3://agree-prod-wepay-admin/.env ./
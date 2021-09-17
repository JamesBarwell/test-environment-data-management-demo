start:
	cd app && npm run start

seed: destroy
	cd app && npm run seed

destroy:
	rm -f database/db.sqlite

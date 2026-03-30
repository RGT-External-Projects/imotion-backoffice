import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTherapistPhoneToPatient1774876542539 implements MigrationInterface {
    name = 'AddTherapistPhoneToPatient1774876542539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patients" ADD "therapist_phone_id" uuid`);
        await queryRunner.query(`ALTER TABLE "patients" ADD CONSTRAINT "FK_7642089285e796fade945fab5da" FOREIGN KEY ("therapist_phone_id") REFERENCES "therapist_phones"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patients" DROP CONSTRAINT "FK_7642089285e796fade945fab5da"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "therapist_phone_id"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPatientPreferredSettings1774471469016 implements MigrationInterface {
    name = 'AddPatientPreferredSettings1774471469016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patients" ADD "preferred_settings" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "preferred_settings"`);
    }

}

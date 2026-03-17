import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorPatientEntity1773767260736 implements MigrationInterface {
    name = 'RefactorPatientEntity1773767260736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Step 1: Add new columns as nullable
        await queryRunner.query(`ALTER TABLE "patients" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "patients" ADD "tags" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "patients" ADD "status" character varying NOT NULL DEFAULT 'active'`);
        
        // Step 2: Migrate existing data (concatenate first_name + last_name)
        await queryRunner.query(`UPDATE "patients" SET "name" = CONCAT("first_name", ' ', "last_name") WHERE "first_name" IS NOT NULL AND "last_name" IS NOT NULL`);
        
        // Step 3: Make name column NOT NULL
        await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "name" SET NOT NULL`);
        
        // Step 4: Drop old columns
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "display_name"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "age"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "tags"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "patients" ADD "age" integer`);
        await queryRunner.query(`ALTER TABLE "patients" ADD "last_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patients" ADD "first_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patients" ADD "display_name" character varying`);
    }

}

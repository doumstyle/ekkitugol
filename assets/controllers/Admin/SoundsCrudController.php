<?php

namespace App\Controller\Admin;

use App\Entity\Sounds;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Form\Type\FileUploadType;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class SoundsCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Sounds::class;
    }

    
    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm()->hideOnIndex(),
            TextField::new('letter'),
            TextField::new('example'),
            TextField::new('audio')
                ->setFormType(FileUploadType::class)
                ->setCustomOption('basePath', 'audio/letters')
                ->setFormTypeOptions(['upload_dir' => '/public/audio/letters'])
                ->setCustomOption('uploadedFileNamePattern', '[randomhash].[extension]')
                ->setRequired(false),
            TextField::new('translation'),
            DateField::new('createdAt', )->hideOnForm(),

        ];
    }
    
}

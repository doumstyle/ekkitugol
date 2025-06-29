<?php

namespace App\Controller\Admin;

use App\Entity\Profile;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use Symfony\Bundle\SecurityBundle\Security;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class ProfileCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Profile::class;
    }

    private Security $security;
    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public function persistEntity(EntityManagerInterface $entityMgmt, $entityInstance): void
    {
        if (!$entityInstance instanceof Profile)
            return;
        $user = $this->security->getUser();
        $entityInstance->setUser($user);

        parent::persistEntity($entityMgmt, $entityInstance);
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm()->hideOnIndex(),
            ImageField::new('picture')->setBasePath('images/profiles')->setUploadDir('/public/images/profiles')->setUploadedFileNamePattern('[randomhash].[extension]')->setRequired(false),
            TextareaField::new('description'),
            DateField::new('createdAt')->hideOnForm(),
            DateField::new('updatedAt')->hideOnForm(),
            AssociationField::new('user')->hideOnForm(),
            IntegerField::new('xp'),
            IntegerField::new('ranking')
        ];
    }

}
